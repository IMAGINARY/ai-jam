# ai-jam

IMAGINARY exhibit version of the MAGENTA [AI Jam](https://github.com/tensorflow/magenta-demos/tree/master/ai-jam-js)
demo.

This repository was created to track our modifications of the AI Jam demo and to document and simplify the
installation and deployment process. It's not a fork because the AI Jam demo is a single folder of the whole
Magenta demos repository. However, the key parts of the demo (the AI model and AI-MIDI interface) are external
dependencies.

## Installation

1. Install virtualenv:
```
pip install virtualenv
```

2. Create a virtual environment for Python 2.7:

```
virtualenv --python=/usr/bin/python2.7 <env directory>
```

3. Install magenta v0.1.15 within the new environment:
```
<env directory>/bin/pip install magenta==0.1.15

```

4. Make the `public` directory accesible using a web server.

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
webpack
```

to compile the sources into the public/build directory.

