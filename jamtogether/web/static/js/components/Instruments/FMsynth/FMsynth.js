import React, { Component } from 'react';
import Tone from 'tone';
import {generateSampler, generatePianoKeyboard, handleMonophonicNoteTriggers} from '../samplerHelper.js';
import classnames from 'classnames';

let playingNotes = [];

export class FMsynth extends Component {

  constructor(props) {
    super(props);

    this.sampler = new Tone.SimpleFM({
      'modulationIndex': 12.22,
      'carrier': {
        'envelope': {
          'attack': 0.01,
          'decay': 0.2
        }
      },
      'modulator': {
        'oscillator': {
          'type': 'square'
        },
        'envelope': {
          'attack': 0.2,
          'decay': 0.01
        }
      }
    });

    const vol = new Tone.Volume(-32); // a little more quiet than the piano. Should be a control later on.
    this.sampler.chain(vol, Tone.Master);
  }

  componentWillUnmount() {
    this.sampler.dispose(); //cleanup
  }

  componentWillReceiveProps(nextProps) {
    // use this & next props to handle note triggers
    handleMonophonicNoteTriggers(nextProps.notes, this.props.notes, nextProps.sustain, this.props.sustain, this.sampler);

    // always update the component.
    return true;
  }

  _renderPianoKeys() {
    return generatePianoKeyboard(this.props.notes);
  }

  render() {
    return (
      <div>
        <div className="piano-keyboard-keys-wrapper">
          {this._renderPianoKeys()}
        </div>
      </div>
    );
  }
}

FMsynth.displayName = 'FMsynth';