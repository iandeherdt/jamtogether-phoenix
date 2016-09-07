import React, { Component } from 'react';
import { SteinwayGrand } from '../Instruments/SteinwayGrand/SteinwayGrand.js';
import { FMsynth } from '../Instruments/FMsynth/FMsynth.js';
import { ComputerKeyboard } from '../KeyControllers/ComputerKeyboard.js';
import { BeatMachine } from '../Instruments/BeatMachine/BeatMachine.js';

class Index extends Component {
  constructor() {
    super();
    this.state = {
      controlledInstrument: 'piano'
    };
  }

  render() {
    return (
      <div>
        <h2>Choose your instrument:</h2>
        <button onClick={()=> this.setState({controlledInstrument: 'piano'})}>Play with the piano (default)</button>
        <button onClick={()=> this.setState({controlledInstrument: 'synth'})}>Play with the synth</button>
        <button onClick={()=> this.setState({controlledInstrument: 'beatMachine'})}>Play with the beat machine</button>

        {/* the piano */}
        <h2>piano:</h2>
        <ComputerKeyboard instrument="piano" controlled={this.state.controlledInstrument === 'piano'}>
          <SteinwayGrand />
        </ComputerKeyboard>

        {/* the synth */}
        <h2>synth:</h2>
        <ComputerKeyboard instrument="synth" controlled={this.state.controlledInstrument === 'synth'}>
          <FMsynth />
        </ComputerKeyboard>

        {/* the beat machine */}
        <h2>Beat machine:</h2>
        <ComputerKeyboard instrument="beatMachine" controlled={this.state.controlledInstrument === 'beatMachine'}>
          <BeatMachine />
        </ComputerKeyboard>

      </div>
    );
  }
}

export default Index;
