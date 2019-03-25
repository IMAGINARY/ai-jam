# Magenta model info

## Drum

- Drums RNN: This model applies language modeling to drum track generation using an LSTM. ([See more](https://github.com/tensorflow/magenta/blob/master/magenta/models/drums_rnn/README.md)).
- Trained on thousands of MIDI files.

## Piano

### Attention RNN

- https://magenta.tensorflow.org/2016/07/15/lookback-rnn-attention-rnn/
- https://github.com/tensorflow/magenta/blob/master/magenta/models/melody_rnn/README.md#attention
- Pre-trained on thousands of MIDI files.

### Pianoroll RNN-NADE

- https://github.com/tensorflow/magenta/blob/master/magenta/models/pianoroll_rnn_nade/README.md

### Performance RNN

- Blog: https://magenta.tensorflow.org/performance-rnn
- Performance RNN, an LSTM-based recurrent neural network designed to model polyphonic music with expressive timing and dynamics.
https://colab.research.google.com/notebooks/magenta/performance_rnn/performance_rnn.ipynb
- Trained on real performances from the Yamaha e-Piano Competition.

# Some general definitions / theory

## LSTM

- Long Short Term Memory networks – are a special kind of RNN, capable of learning long-term dependencies.
- http://colah.github.io/posts/2015-08-Understanding-LSTMs/

## RNNs

- The LSTM is a particular type of recurrent network that works slightly better in practice, owing to its more powerful update equation and some appealing backpropagation dynamics
- http://karpathy.github.io/2015/05/21/rnn-effectiveness/



