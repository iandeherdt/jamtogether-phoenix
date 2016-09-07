import React, { Component } from 'react';
import _ from 'lodash';
import Notes from './helpers.js';

let lastEvent;
let heldKeys = {};
let keysToListenTo = ['81', '90', '83', '69', '68', '70', '84', '71', '89', '72', '85', '74', '75', '79', '76', '80', '77', '87', '88', '16'];

function generateKeyboardSynth(octave) {
  let higherOctave = octave + 1;
  return {
    '81': 'C' + octave,
    '90': 'Db' + octave,
    '83': 'D' + octave,
    '69': 'Eb' + octave,
    '68': 'E' + octave,
    '70': 'F' + octave,
    '84': 'Gb' + octave,
    '71': 'G' + octave,
    '89': 'Ab' + octave,
    '72': 'A' + octave,
    '85': 'Bb' + octave,
    '74': 'B' + octave,
    '75': 'C' + higherOctave,
    '79': 'Db' + higherOctave,
    '76': 'D' + higherOctave,
    '80': 'Eb' + higherOctave,
    '77': 'E' + higherOctave,
  };
}

export class ComputerKeyboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sustain: false,
      notes: Notes,
      playingNotes: [],
      currentOctave: 3,
    };

    this.keySynth = generateKeyboardSynth(3); //init keysynth

    // bindings
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
  }

  componentDidMount() {
    if (this.props.controlled) {
      this._connectEventHandlers();
    }
    this._setupSockets();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.controlled) {
      this._unconnectEventHandlers();
    } else {
      this._connectEventHandlers();
    }
  }

  componentWillUnmount() {
    this._unconnectEventHandlers();
  }

  _unconnectEventHandlers() {
    window.removeEventListener('keydown', this._handleKeyDown);
    window.removeEventListener('keyup', this._handleKeyUp);
  }

  _connectEventHandlers() {
    window.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('keyup', this._handleKeyUp);
  }

  _setupSockets() {
    // trigger this.props.children.type.displayName specific socket messages.
    // TODO: organize socket messaging. this is a bit of a mess.
  }
  _handleKeyDown(e) {
    // return early if key was already depressed
    if (lastEvent && lastEvent.keyCode === e.keyCode) {
      return;
    }

    lastEvent = e;
    heldKeys[e.keyCode] = true;

    // don't handle updates for keys we don't want to listen to.
    if (_.findIndex(keysToListenTo, key => e.keyCode.toString() === key) < 0) {
      return;
    }

    // handle octave changes
    if (e.keyCode === 87 && this.state.currentOctave > 0) {
      // pressed the 'W' key
      //update keysynth & state
      this.keySynth = generateKeyboardSynth(this.state.currentOctave - 1);
      this.setState({
        currentOctave: this.state.currentOctave - 1
      });
      return;

    } else if (e.keyCode === 88 && this.state.currentOctave < 5) {
      // pressed the 'X' key
      //update keysynth & state
      this.keySynth = generateKeyboardSynth(this.state.currentOctave + 1);
      this.setState({
        currentOctave: this.state.currentOctave + 1
      });
      return;

    } else if (e.keyCode === 16) {
      // pressed the 'shift key', we want to sustain the notes
      //socket.emit(this.props.children.type.displayName + ' sustain on');

    } else if (e.keyCode !== 87 && e.keyCode !== 88 && e.keyCode !== 16) {

      // send a note on event, only if we're pressing a 'note' key.
      //socket.emit(this.props.children.type.displayName + ' note on', this.keySynth[e.keyCode.toString()]);
    }
  }

  _handleKeyUp(e) {

    // update depressed keys
    lastEvent = null;
    delete heldKeys[e.keyCode];

    // don't handle updates for keys we don't want to listen to.
    if (_.findIndex(keysToListenTo, key => e.keyCode.toString() === key) < 0) {
      return;
    }

    if (e.keyCode === 16) {
      //socket.emit(this.props.children.type.displayName + ' sustain off');
    }

    // we're changing the octave; we don't want to send a note off event
    if (e.keyCode === 87 || e.keyCode === 88 || e.keyCode === 16) {
      return;
    }

    // send note-off event
    //socket.emit(this.props.children.type.displayName + ' note off', this.keySynth[e.keyCode.toString()]);
  }

  _renderChildren() {
    const childrenWithNotesProp = React.Children.map(this.props.children,
      (child) => {
        return React.cloneElement(child, {
          notes: this.state.notes,
          sustain: this.state.sustain
        });
      }
    );

    return childrenWithNotesProp;
  }

  render() {
    let notes = this.state.playingNotes.map(note => {
      return <span key={note}>note: {note}</span>;
    });
    return (
      <div>
        octave: {this.state.currentOctave}
        {this._renderChildren()}
      </div>
    );
  }
}
