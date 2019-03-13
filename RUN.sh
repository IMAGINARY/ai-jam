#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PYTHONENV=${DIR}/env
MODELPATH=${DIR}/models

echo "Starting MIDI Clock"
${PYTHONENV}/bin/midi_clock\
  --output_ports="magenta_clock" \
  --qpm=120 \
  --channel=0 \
  --clock_control_number=1 \
  --log=INFO &
MIDI_CLOCK=$!

trap "kill ${MIDI_CLOCK}; exit 1" SIGINT SIGTERM EXIT INT

FULL_CLOCK_PORT="$(${PYTHONENV}/bin/python ${DIR}/aux/find_port.py magenta_clock)"
if [ "$FULL_CLOCK_PORT" == "" ]; then
  echo "MIDI Clock port not found"
  exit 1
fi
echo "MIDI Clock port found: ${FULL_CLOCK_PORT}"

echo "Starting Drum process"
${PYTHONENV}/bin/magenta_midi \
  --input_ports="magenta_drums_in,"${FULL_CLOCK_PORT} \
  --output_ports="magenta_out" \
  --bundle_files=${MODELPATH}/drum_kit_rnn.mag\
  --qpm=120 \
  --allow_overlap=true \
  --playback_channel=9 \
  --enable_metronome=false \
  --passthrough=false \
  --clock_control_number=1 \
  --min_listen_ticks_control_number=3 \
  --max_listen_ticks_control_number=4 \
  --response_ticks_control_number=5 \
  --temperature_control_number=6 \
  --generator_select_control_number=8 \
  --loop_control_number=10 \
  --panic_control_number=11 \
  --mutate_control_number=12 \
  --log=INFO &
MAGENTA_DRUMS=$!

trap "kill ${MIDI_CLOCK} ${MAGENTA_DRUMS}; exit 1" SIGINT SIGTERM EXIT INT

echo "Starting Piano process"
${PYTHONENV}/bin/magenta_midi \
  --input_ports="magenta_piano_in,"${FULL_CLOCK_PORT} \
  --output_ports="magenta_out" \
  --bundle_files=${MODELPATH}/attention_rnn.mag,${MODELPATH}/pianoroll_rnn_nade.mag \
  --qpm=120 \
  --allow_overlap=true \
  --playback_channel=0 \
  --enable_metronome=false \
  --passthrough=false \
  --generator_select_control_number=0 \
  --clock_control_number=1 \
  --min_listen_ticks_control_number=3 \
  --max_listen_ticks_control_number=4 \
  --response_ticks_control_number=5 \
  --temperature_control_number=6 \
  --generator_select_control_number=8 \
  --loop_control_number=10 \
  --panic_control_number=11 \
  --mutate_control_number=12 \
  --log=INFO &
MAGENTA_PIANO=$!

trap "kill ${MIDI_CLOCK} ${MAGENTA_PIANO} ${MAGENTA_DRUMS}; exit 1" SIGINT SIGTERM EXIT INT

wait
