import React, { Component } from 'react';
import Tone from 'tone';
import {generateSampler, generatePianoKeyboard, handlePolyphonicSamplerNoteTriggers} from '../samplerHelper.js';
import classnames from 'classnames';

let playingNotes = [];
export class SteinwayGrand extends Component {

  constructor(props) {
    super(props);

    this.state = {
      samplesLoaded: false
    };

    this.sampler = generateSampler(Object.keys(props.notes), 'SteinwayGrand');
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
    if (this.state.samplesLoaded) {
      // use this & next props to handle note triggers
      handlePolyphonicSamplerNoteTriggers(nextProps.notes, this.props.notes, nextProps.sustain, this.props.sustain, this.sampler);
    }

    // always update the component.
    return true;
  }

  _renderPianoKeys() {
    // generate piano keyboard from helper function in samplerHelper.js
    return generatePianoKeyboard(this.props.notes);
  }

  render() {
    if (this.state.samplesLoaded) {
      return (
        <div>
          <div className="piano-keyboard-keys-wrapper">
            {this._renderPianoKeys()}
          </div>
        </div>
      );
    }

    return (
      <div>
        {'loading the samples, please be patient. It is a GRAND piano after all,...'}
      </div>
    );
  }
}

// we need a displayname to ID the correct instrument being put inside the key controllers
SteinwayGrand.displayName = 'SteinwayGrand';
