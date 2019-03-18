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

import CfgLoader from './CfgLoader';
import {Magenta} from 'ai/Magenta'
import {Keyboard} from 'keyboard/Keyboard'
import {Midi} from 'keyboard/Midi'
import {Sound} from 'sound/Sound'
import {Controls} from 'interface/Controls'
import {Glow} from 'interface/Glow'
import {Splash} from 'interface/Splash'
import {About} from 'interface/About'
import {Status} from 'interface/Status'
import 'babel-polyfill'
import Tone from 'Tone/core/Tone'

const cfgLoader = new CfgLoader();
cfgLoader.load('cfg/config.yml').then((cfg) => {

/////////////// PIANO ///////////////////

	const container = document.createElement('div')
	container.id = 'container'
	document.body.appendChild(container)

	const status = new Status(container)

	const magenta = new Magenta(status)
	const midi = new Midi(magenta)
	const glow = new Glow(container)
	const keyboard = new Keyboard(container, midi, magenta, status, cfg)
	const controls = new Controls(container, magenta, keyboard)

	if(cfg.hideManualControls) {
		controls.hide();
	}

	magenta.on('active', () => {
		controls.reset();
		if(cfg.pianoCallBars !== undefined) {
			controls.setPianoCallBars(cfg.pianoCallBars);
		}

		if(cfg.pianoResponseBars !== undefined) {
			controls.setPianoResponseBars(cfg.pianoResponseBars);
		}

		if(cfg.drumCallBars !== undefined) {
			controls.setDrumCallBars(cfg.drumCallBars);
		}

		if(cfg.drumResponseBars !== undefined) {
			controls.setDrumResponseBars(cfg.drumResponseBars);
		}

		if(cfg.metronomeEnabled !== undefined) {
			if (cfg.metronomeEnabled) {
				controls.enableMetronome();
			} else {
				controls.disableMetronome();
			}
		}

		if(cfg.pianoTemperature !== undefined) {
			controls.setPianoTemperature(cfg.pianoTemperature);
		}

		if(cfg.drumTemperature !== undefined) {
			controls.setDrumTemperature(cfg.drumTemperature);
		}
	})

	const sound = new Sound()
	sound.load().then(() => {
		if (cfg.metronomeVolume !== undefined) {
			sound.metronomeVolume(cfg.metronomeVolume);
		}
	});

	var isShifted = false
	document.body.addEventListener('keydown', (e) => {
		if (e.keyCode == 16) {
			isShifted = true
		}
	}, true)
	document.body.addEventListener('keyup', (e) => {
		if (e.keyCode == 16) {
			isShifted = false
		} else if (isShifted && e.keyCode >= 48 && e.keyCode <= 56) {  // SHIFT + 0-8
			controls.setCallBars(e.keyCode - 48)
		} else if (e.keyCode >= 48 && e.keyCode <= 56) {  // 0-8
			controls.setResponseBars(e.keyCode - 48)
		} else if (e.keyCode == 37) {  // Left arrow
			controls.adjustModelIndex(-1)
		} else if (e.keyCode == 39) {  // Right arrow
			controls.adjustModelIndex(1)
		} else if (e.keyCode == 32) {  // Space bar
			controls.toggleLoop()
		} else if (e.keyCode == 77) {  // M
			controls.triggerMutate()
		} else if (e.keyCode == 38) {  // Up arrow
			controls.adjustTemperature(2)
		} else if (e.keyCode == 40) {  // Down arrow
			controls.adjustTemperature(-2)
		} else if (e.keyCode == 8) {  // Backspace/Delete
			controls.triggerPanic()
		} else if (e.keyCode == 81) {  // Q
			controls.toggleInstrument()
		} else if (e.keyCode == 90) {  // Z
			controls.toggleMetronome()
		} else if (e.keyCode == 88) {  // S
			controls.toggleSolo()
		}
	}, true)

	keyboard.on('keyDown', (note, time, ai=false, drum=false) => {
		sound.keyDown(note, time, ai, drum)
		if (ai) {
			glow.ai()
		} else {
			glow.user()
		}
	})

	keyboard.on('keyUp', (note, time, ai=false, drum=false) => {
		sound.keyUp(note, time, ai, drum)
	})

	midi.on('metronomeTick', (note) => {
		if (note == 1) {
			status.setMetronome(0)
		} else {
			status.incrementMetronome()
		}
		if (controls.metronomeEnabled()) {
			sound.metronomeTick(note)
		}
	})

	/////////////// SPLASH ///////////////////

	const about = new About(document.body)

	function startApp() {
		keyboard.activate()
		if (!cfg.hideInfoButton) {
			about.showButton()
		}
	}

	if (cfg.skipStartScreen) {
		startApp();
	} else {
		const splash = new Splash(document.body)
		splash.on('click', () => {
			startApp();
		})
		splash.on('about', () => {
			about.open(true)
		})
		about.on('close', () => {
			if (!splash.loaded || splash.isOpen()){
				splash.show()
			} else {
				keyboard.activate()
			}
		})
		about.on('open', () => {
			keyboard.deactivate()
			if (splash.isOpen()){
				splash.hide()
			}
		})
	}

}).catch((err) => {
	console.error(err);
});
