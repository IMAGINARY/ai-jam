import {InstrumentElement} from 'keyboard/InstrumentElement';

const offsets = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6]

class KeyboardElement extends InstrumentElement {

  constructor(container, id, interactive=true, lowest=36, octaves=4) {
    super(container, id, interactive);

    this.lowest = lowest;
    this.octaves = octaves;
    this.render();
  }


  render(){
    this._keys = {}
    // clear the previous ones
    this._container.innerHTML = ''
    // each of the keys
    const keyWidth = 1 / (7 * this.octaves + 1);
    for (let i = this.lowest; i < this.lowest + this.octaves * 12 + 1; i++){
      let key = document.createElement('div')
      key.classList.add('key')
      let isSharp = ([1, 3, 6, 8, 10].indexOf(i % 12) !== -1)
      key.classList.add(isSharp ? 'black' : 'white')
      this._container.appendChild(key)
      // position the element

      let noteOctave = Math.floor(i / 12) - Math.floor(this.lowest / 12)
      let offset = offsets[i % 12] + noteOctave * 7
      key.style.width = `${keyWidth * 100}%`
      key.style.left = `${offset * keyWidth * 100}%`
      key.id = i.toString()
      key.setAttribute('touch-action', 'none')

      const fill = document.createElement('div')
      fill.id = 'fill'
      key.appendChild(fill)

      if (this.interactive) {
        this._bindKeyEvents(key);
      }
      this._keys[i] = key
    }
  }
}

export {KeyboardElement}