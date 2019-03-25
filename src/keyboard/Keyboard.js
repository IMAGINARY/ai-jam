/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AudioKeys from 'audiokeys'
import Tone from 'Tone/core/Tone'
import events from 'events'
import {KeyboardElement} from 'keyboard/KeyboardElement'
import {DrumElement} from 'keyboard/DrumElement'
import buckets from 'buckets-js'
import Buffer from 'Tone/core/Buffer'
import {Roll} from 'roll/Roll'

class Keyboard extends events.EventEmitter{
	constructor(container, midi, magenta, notifier, cfg){
		super()

		this._container = container
		this._midi = midi
		this._magenta = magenta
		this._notifier = notifier

		this._active = false
		this._drumMode = false
		this._soloMode = false
		this._skipNextMidiEvent = false;

		/**
		 * The audio key keyboard
		 * @type {AudioKeys}
		 */
		this._keyboard = new AudioKeys({polyphony : 88, rows : 1, octaveControls : false})
		this._keyboard.down((e) => {
			// The drums model only plays lower "notes".
			var note = e.note - this._drumMode * 24
			this.keyDown(note, undefined, false, this._drumMode)
			this._emitKeyDown(note, undefined, false, this._drumMode)
		})
		this._keyboard.up((e) => {
			// The drums model only plays lower "notes".
			var note = e.note - this._drumMode * 24
			this.keyUp(note, undefined, false, this._drumMode)
			this._emitKeyUp(note, undefined, false, this._drumMode)
		})

		/**
		 * The piano interface
		 */
		const interactive = cfg.interactiveOnScreenPiano != undefined ?
			cfg.interactiveOnScreenPiano : true;
		this._keyboardInterface = new KeyboardElement(
			container,
			'keyboard',
			interactive,
			cfg.onScreenPianoLowestNote !== undefined ? cfg.onScreenPianoLowestNote : 48,
			cfg.onScreenPianoOctaveCount !== undefined ? cfg.onScreenPianoOctaveCount : 4
		);
		this._keyboardInterface.on('keyDown', (note) => {
			this.keyDown(note, undefined, false, false)
			this._emitKeyDown(note, undefined, false, false)
		})
		this._keyboardInterface.on('keyUp', (note) => {
			this.keyUp(note, undefined, false, false)
			this._emitKeyUp(note, undefined, false, false)
		})

		this._drumInterface = new DrumElement(
			container,
			'drum',
			interactive,
			cfg.onScreenDrumPitches !== undefined ? cfg.onScreenDrumPitches : [36, 38, 42, 46, 45, 50, 49, 51]
		);
		this._drumInterface.on('keyDown', (note) => {
			this.keyDown(note, undefined, false, true);
			this._emitKeyDown(note, undefined, false, true);
		});
		this._drumInterface.on('keyUp', (note) => {
			this.keyUp(note, undefined, false, true);
			this._emitKeyUp(note, undefined, false, true);
		});

		Roll.appendTo(container)

		window.addEventListener('resize', this._resize.bind(this))
		//size initially
		this._resize()

		//make sure they don't get double clicked
		this._currentKeys = {}

		//a queue of all of the events
		this._eventQueue = new buckets.PriorityQueue((a, b) => b.time - a.time)
		this._boundLoop = this._loop.bind(this)
		this._loop()

		const bottom = document.createElement('div')
		bottom.id = 'bottom'
		container.appendChild(bottom)

		this._downKeys = {
			k: {},
			d: {}
		};

		//the midi input
		this._midi.on('keyDown', (note, time, ai, drum) => {
			if (!ai) {
				if (this._skipNextMidiEvent) {
					console.log("DEBUG: MIDI event keyDown skipped");
					this._skipNextMidiEvent = false;
					return;
				}
				// if a key was already down and we didn't get a keyUp (MPX8 bug)
				// then let's send the up first
				if (this._downKeys[drum ? 'd' : 'k'][note] === true) {
					this.keyUp(note, time, ai, drum)
					this._emitKeyUp(note, time, ai, drum)
				}
				this._downKeys[drum ? 'd' : 'k'][note] = true;
			}
			this.keyDown(note, time, ai, drum)
			this._emitKeyDown(note, time, ai, drum)
		})
		this._midi.on('keyUp', (note, time, ai, drum) => {
			if (!ai) {
				if (this._skipNextMidiEvent) {
					console.log("DEBUG: MIDI event keyUp skipped");
					this._skipNextMidiEvent = false;
					return;
				}
				this._downKeys[drum ? 'd' : 'k'][note] = false;
			}
			this.keyUp(note, time, ai, drum)
			this._emitKeyUp(note, time, ai, drum)
		})
	}

	_loop(){
		requestAnimationFrame(this._boundLoop)
		const now = Tone.now()
		while(!this._eventQueue.isEmpty() && this._eventQueue.peek().time <= now){
			const event = this._eventQueue.dequeue()
			event.callback()
		}
	}

	_emitKeyDown(note, time=Tone.now(), ai=false, drum=false){
		if (this._active){
			this.emit('keyDown', note, time, ai, drum)
		}
	}

	_emitKeyUp(note, time=Tone.now(), ai=false, drum=false){
		if (this._active){
			this.emit('keyUp', note, time, ai, drum)
		}
	}

	keyDown(note, time=Tone.now(), ai=false, drum=false){
		if (!this._active){
			return
		}
		if (!ai && !this._soloMode) {
			if (drum) {
				this._magenta.drumInstance().sendKeyDown(note);
			} else {
				this._magenta.pianoInstance().sendKeyDown(note);
			}
		}
		if (!this._currentKeys[note]){
			this._currentKeys[note] = 0
		}
		this._currentKeys[note] += 1
		this._eventQueue.add({
			time : time,
			callback : drum ?
				this._drumInterface.keyDown.bind(this._drumInterface, note, ai) :
				this._keyboardInterface.keyDown.bind(this._keyboardInterface, note, ai)
		})
	}

	keyUp(note, time=Tone.now(), ai=false, drum=false){
		if (!this._active){
			return
		}
		if (!ai && !this._soloMode) {
			if (drum) {
				this._magenta.drumInstance().sendKeyUp(note);
			} else {
				this._magenta.pianoInstance().sendKeyUp(note);
			}
		}
		//add a little time to it in edge cases where the keydown and keyup are at the same time
		time += 0.01
		if (this._currentKeys[note]){
			this._currentKeys[note] -= 1
			this._eventQueue.add({
				time : time,
				callback : drum ?
					this._drumInterface.keyUp.bind(this._drumInterface, note, ai) :
					this._keyboardInterface.keyUp.bind(this._keyboardInterface, note, ai)
			})
		}
	}

	toggleDrumMode() {
		this._drumMode = !this._drumMode
		this._keyboardInterface.panic(true)
		this._keyboardInterface.panic(false)
		if (this._drumMode) {
			this._notifier.notify('Switched to <b>Drums</b>')
		} else {
			this._notifier.notify('Switched to <b>Piano</b>')
		}
	}

	toggleSoloMode() {
		this._soloMode = !this._soloMode
		if (this._soloMode) {
			this._notifier.notify('<b>Solo Mode</b> enabled')
		} else {
			this._notifier.notify('<b>Solo Mode</b> disabled')
		}
	}

	_resize(){
		const keyWidth = 24
		let octaves = Math.round((window.innerWidth / keyWidth) / 12)
		octaves = Math.max(octaves, 2)
		octaves = Math.min(octaves, 7)
		let baseNote = 36
		this._keyboardInterface.render(baseNote, octaves)
	}

	activate(){
		container.classList.add('focus')
		this._active = true
	}

	deactivate(){
		container.classList.remove('focus')
		this._active = false
	}

	// For debugging only
	skipNextMidiEvent() {
		this._skipNextMidiEvent = true;
	}
}

export {Keyboard}