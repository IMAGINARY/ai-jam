import {InstrumentElement} from 'keyboard/InstrumentElement';

class DrumElement extends InstrumentElement {

  constructor(container, id, interactive=true, pitches=[]) {
    super(container, id, interactive);

    this.pitches = pitches;
    this.render();
  }

  render(){
    this._keys = {}
    // clear the previous ones
    this._container.innerHTML = '';
    // each of the keys
    const keyWidth = 1 / this.pitches.length;
    this.pitches.forEach((eachPitch, index) => {
      let key = document.createElement('div');
      key.classList.add('key');
      key.classList.add('white');
      this._container.appendChild(key);

      key.style.width = `${keyWidth * 80}%`
      key.style.left = `${keyWidth * index * 100 + keyWidth * 20}%`
      key.id = eachPitch.toString();
      key.setAttribute('touch-action', 'none');
      const fill = document.createElement('div');
      fill.id = 'fill';
      key.appendChild(fill);

      if (this.interactive) {
        this._bindKeyEvents(key);
      }
      this._keys[eachPitch] = key
    });
  }
}

export {DrumElement}