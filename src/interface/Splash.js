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

import Buffer from 'Tone/core/Buffer'
import 'style/splash.scss'
import events from 'events'
import Loader from 'interface/Loader'

class Splash extends events.EventEmitter{
	constructor(container){

		super()
		const splash = this._splash = document.createElement('div')
		splash.id = 'splash'
		container.appendChild(splash)

		// the title
		const titleContainer = document.createElement('div')
		titleContainer.id = 'titleContainer'
		splash.appendChild(titleContainer)

		const title = document.createElement('div')
		title.id = 'title'
		title.textContent = 'A.I. Jam'
		titleContainer.appendChild(title)

		const subTitle = document.createElement('div')
		subTitle.id = 'subTitle'
		titleContainer.appendChild(subTitle)
		subTitle.textContent = 'An interactive A.I. jam session.'

		this._clicked = false
		const loader = this._loader = new Loader(titleContainer)
		loader.on('click', () => {
			splash.classList.add('disappear')
			this._clicked = true
			this.emit('click')
		})

		const badges = document.createElement('div')
		badges.id = 'badges'
		splash.appendChild(badges)

		const aiExperiments = document.createElement('div')
		aiExperiments.id = 'aiExperiments'
		aiExperiments.classList.add('badge')
		badges.appendChild(aiExperiments)

		// break
		const break0 = document.createElement('div')
		break0.classList.add('badgeBreak')
		badges.appendChild(break0)

		const googleFriends = document.createElement('a')
		googleFriends.id = 'googleFriends'
		googleFriends.classList.add('badge')
		badges.appendChild(googleFriends)

		//break two
		const break1 = document.createElement('div')
		break1.classList.add('badgeBreak')
		badges.appendChild(break1)

		const magenta = document.createElement('div')
		magenta.id = 'magentaLink'
		magenta.classList.add('badge')
		const imgHtml = '<div id="img"></div>'
		magenta.innerHTML = imgHtml + '<div id="text">Built using <span>Magenta</span></div>'
		badges.appendChild(magenta)

	}

	get loaded(){
		return this._loader.loaded
	}

	isOpen(){
		return !this._clicked
	}

	show(){
		this._splash.classList.remove('disappear')
	}

	hide(){
		this._splash.classList.add('disappear')
	}
}

export {Splash}
