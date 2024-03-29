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

import events from 'events'
import 'style/keyboard.scss'
import 'pepjs'
import {Note} from 'keyboard/Note'

class InstrumentElement extends events.EventEmitter {

	constructor(container, id, interactive=true){
		super()
		this.interactive = interactive;
		this._container = document.createElement('div')
		this._container.id = id;
		this._container.classList.add('instrument');
		container.setAttribute('touch-action', 'none')
		container.appendChild(this._container)

		//some default menu stuff
		container.addEventListener('pointerup', (e) => delete this._pointersDown[e.pointerId])
		container.addEventListener('contextmenu', this._absorbEvent.bind(this))

		this._keys = {}

		this._pointersDown = {}

		this._aiNotes = {}
		this._notes = {}
	}

	render() {
		// Abstract function
	}

	_absorbEvent(event) {
		const e = event || window.event;
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		e.cancelBubble = true;
		e.returnValue = false;
		return false;
	}

	_bindKeyEvents(key){

		key.addEventListener('pointerover', (e) => {
			if (this._pointersDown[e.pointerId]){
				const noteNum = parseInt(e.target.id)
				this.emit('keyDown', noteNum)
			} else {
				key.classList.add('hover')
			}
		})
		key.addEventListener('pointerout', (e) => {
			if (this._pointersDown[e.pointerId]){
				const noteNum = parseInt(e.target.id)
				this.emit('keyUp', noteNum)
			} else {
				key.classList.remove('hover')
			}
		})
		key.addEventListener('pointerdown', (e) => {
			const noteNum = parseInt(e.target.id)
			// this.keyDown(noteNum, false)
			this.emit('keyDown', noteNum)
			this._pointersDown[e.pointerId] = true
		})
		key.addEventListener('pointerup', (e) => {
			const noteNum = parseInt(e.target.id)
			// this.keyUp(noteNum, false)
			this.emit('keyUp', noteNum)
			delete this._pointersDown[e.pointerId]
		})

		// cancel all the pointer events to prevent context menu which keeps the key stuck
		key.addEventListener('touchstart', this._absorbEvent.bind(this))
		key.addEventListener('touchend', this._absorbEvent.bind(this))
		key.addEventListener('touchmove', this._absorbEvent.bind(this))
		key.addEventListener('touchcancel', this._absorbEvent.bind(this))
	}

	panic(ai=false){
		const noteArray = ai ? this._aiNotes : this._notes
		for (var noteNum in noteArray) {
		  if (noteArray.hasOwnProperty(noteNum)) {
		  	this.keyUp(noteNum, ai)
			}
		}
	}

	keyDown(noteNum, ai=false){
		// console.log('down', noteNum, ai)
		if (this._keys.hasOwnProperty(noteNum)){
			const key = this._keys[noteNum]
			key.classList.remove('hover')

			const note = new Note(key.querySelector('#fill'), ai)

			const noteArray = ai ? this._aiNotes : this._notes
			if (!noteArray[noteNum]){
				noteArray[noteNum] = []
			}
			noteArray[noteNum].push(note)
		}
	}

	keyUp(noteNum, ai=false){
		// console.log('up', noteNum, ai)
		if (this._keys.hasOwnProperty(noteNum)){
			const noteArray = ai ? this._aiNotes : this._notes
			if (!(noteArray[noteNum] && noteArray[noteNum].length)){
				// throw new Error('note off without note on')
				// setTimeout(() => this.keyUp.bind(this, noteNum, ai), 100)
				console.warn('note off before note on')
			} else {
				noteArray[noteNum].shift().noteOff()
			}
		}
	}
}

export {InstrumentElement}
