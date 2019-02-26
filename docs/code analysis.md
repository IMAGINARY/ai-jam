# Being an analysis of the original UI code and responsibilities of each file / class

## ai/Magenta.js

Exports the class `Magenta`.

### class Magenta

Owns the two `MagentaInstance` instances. Provides access to them and allows toggling between both.

Created in `Main.js`.

### class MagentaInstance (private)

Provides a symbolic interface to a Magenta process via a port (MIDI). Provides constants and methods for setting the
parameters and sending notes.

Created by `Magenta`.

## keyboard/Midi.js

### class Midi

Created in `Main.js`.

Interfaces with WebMidi and the input devices. Provides an event interface with events
`metronomeTick`, `keyDown` and `keyUp`.

Wraps the `Magenta` instance. Injects the MIDI ports into the `MagentaInstance` instances.

## keyboard/Keyboard.js

### class Keyboard

Created in `Main.js`.

Is a controller that concentrates all input (via MIDI, computer keyboard or on screen keyboard) and
sends it to the selected Magenta instance. Controls "Drum mode" (map to lower pitches) and "Solo mode"
(don't send input to Magenta).

Instantiates the audiokeys library (play the piano with the computer keyboard) and the `KeyboardElement`
(on screen keyboard).

## keyboard/Element.js

### class KeyboardElement

Created by `Keyboard`. It draws and handles input for the on-screen keyboard, including the note display.

## keyboard/Note.js

### class Note

The visual display of notes being played. Creates a `RollNote` for rendering using THREE.

Created by `KeyboardElement`.

## roll/RollNote.js

### class RollNote

Visual display of a note using the THREE library.

## roll/Roll.js

### class Roll

Visual display of scrolling notes using the THREE library. It handles the animation loop for scrolling.

## sound/Sound.js

### class Sound

Creates the `Sampler` instances and makes them play. Decides what sound to play based on the midi events.

## sound/Sampler.js

### class Sampler

Loads and plays sampled sounds using Tone.js

## interface/About.js

### class About

The About page.

## interface/Splash.js

### class Splash

The opening splash screen.

## interface/Loader.js

### class Loader

The loader.

## interface/Status.js

### class Status

Handles status messages and the metronome display.

## interface/Controls.js

### class Controls

Draws the UI controls to control the AI.

## interface/Glow.js

### class Glow

Makes the background glow blue or orange depending on who is playing.

## Main.js

Builds the whole app.

Also handles the keyboard interface to control the AI.

## FeatureTest.js

Main entry point. Tests whether the browser has MIDI and WebGL capabilities and fires the `Main.js`.
