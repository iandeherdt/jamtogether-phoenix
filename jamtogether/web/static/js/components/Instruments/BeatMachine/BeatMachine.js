import React, { Component } from 'react';
import style from './beatmachine.scss';
import Tone from 'tone';
import Ink from 'react-ink';
import { generateSampler, handlePolyphonicSamplerNoteTriggers } from '../samplerHelper.js';
import _ from 'lodash';

export class BeatMachine extends Component {

  constructor(props) {
    super(props);

    this.sampler = generateSampler(Object.keys(props.notes), 'BeatMachine');
    this.state = {};
    this._triggerSample = this._triggerSample.bind(this);
  }

  componentDidMount() {
    // listen for when all the samples have loaded
    Tone.Buffer.on('load', () => {
      this.setState({ samplesLoaded: true });
    });
  }

  componentWillUnmount() {
    this.sampler.dispose(); //cleanup
  }

  componentWillReceiveProps(nextProps) {
    // use this & next props to handle note triggers
    handlePolyphonicSamplerNoteTriggers(nextProps.notes, this.props.notes, true, true, this.sampler);

    // always update the component.
    return true;
  }

  _triggerSample(note) {
    // trigger a local note
    this.sampler[note].triggerAttack();
  }

  _renderPads() {
    let pads = [];
    _.forEach(this.props.notes, (note, key) => {
      // only use non flat notes in the third octave for now
      const highlightClass = note.depressed ? 'drumpad-highlight pad' : 'pad';
      if (key[1] !== 'b') {
        pads.push(
          <div className={highlightClass} onClick={this._triggerSample.bind(this, key)}>
            {key}
            <Ink />
          </div>
        );
      }
    });

    // TODO: return only 16 pads max!
    return pads;
  }

  render() {
    if (this.state.samplesLoaded) {
      return (
        <div className="beat-machine-wrapper">
          {this._renderPads()}
        </div>
      );
    }

    return (
      <div>
        {'loading the samples, the beat machine is working it.'}
      </div>
    );
  }
}

BeatMachine.displayName = 'BeatMachine';