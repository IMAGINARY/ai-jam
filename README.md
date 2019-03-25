# ai-jam

IMAGINARY exhibit version of the MAGENTA [AI Jam](https://github.com/tensorflow/magenta-demos/tree/master/ai-jam-js)
demo.

This repository was created to track our modifications of the AI Jam demo and to document and simplify the
installation and deployment process. It's not a fork because the AI Jam demo is a single folder of the whole
Magenta demos repository. However, the key parts of the demo (the AI model and AI-MIDI interface) are external
dependencies.

## Installation

0. If on Linux install the Magenta dependencies

```
sudo apt-get install build-essential libasound2-dev libjack-dev
```


1. Install virtualenv (if needed):
```
sudo pip install virtualenv
```

2. Create a virtual environment for Python 2.7 (change the Python bin as appropriate):

```
virtualenv --python=/usr/bin/python2.7 <env directory>
```

3. Install tensorflow 1.12.0 and magenta v0.1.15 within the new environment:

```
<env directory>/bin/pip install tensorflow==1.12.0
<env directory>/bin/pip install magenta==0.1.15

```

4. Make the `public` directory accesible using a web server.

5. Run the INSTALL.sh script to download the models.

## Configuration

Copy the `public/cfg/sample.config.yml` to `public/cfg/config.yml` and modify it by following the comments.

The app validates the config file using a schema and if there are any problems while parsing you'll find out by
reading the console log.

## Running

Run the `RUN.sh` script to start the engine. Give it some seconds to init and then open the web app by pointing
the browser to the web server where you installed it.

## Compilation

There's no need to compile anything unless you want to make modifications.

To compile, from the root directory run

```
yarn
```

to install webpack and all dependencies. Then run

```
yarn run build
```

to compile the sources into the public/build directory.

## Debugging

To enable the functionality below set the `debug` key to `true` in the config file.

### Skipping MIDI events

MIDI events sometimes get lost, that's a fact of life. It's useful to simulate MIDI events getting lost when
debugging. If the debug mode is enabled you can press the ESC key in the keyboard to ignore the next MIDI event.
For instance you can press ESC and then play a note in the piano to ignore the next MIDI keyDown event or hold a
note, press ESC and then let go the note to ignore the next MIDI keyUp.

