import Tone from 'tone';
import classnames from 'classnames';
import React from 'react'; // although not explicitely used, errors are thrown if we don't import React because we do render JSX in this file
import SteinWayGrandSamples from '../../../public/samples/SteinWayGrand/index.js';
import BeatMachineSamples from '../../../public/samples/drums/index.js';

/******* sampler generator logic *******/

function getSamples(instrument) {
  switch (instrument) {
  case 'SteinWayGrand':
    return SteinWayGrandSamples;
  case 'BeatMachine':
    return BeatMachineSamples;
  default:
    return SteinWayGrandSamples;
  }
}

export function generateSampler($notes, instrument) {
  const samples = getSamples(instrument);
  let smplr = {};
  _.forEach($notes, note => {
    smplr[note] = new Tone.Sampler(samples[note]).toMaster();
  });

  return smplr;
}

/******* common note trigger logic *******/

export function handlePolyphonicSamplerNoteTriggers($nextNotes, $currentNotes, $nextSustain, $sustain, $sampler) {
  /*************

  Note: This logic handles polyphonic (re)triggering of samples. It is not useful for synthesisers.

  MINI-DOC:

  Below logic controls which samples are triggered and when, as well as whether the note should
  sustain or not.

  We look at the current notes object coming in via the next props and compare it to the
  current notes object. Based on the differences, we can decide whether or not to retrigger
  a sample, to end a sample, or to continue playing a sample.

  Notes object looks like this

  const notes = {
    A3: {
      depressed: false || true, // key pressed down or not
      velocity: 0 - 100         // gain of the note.
    }
  }

  *************/

  // remember if a note is already depressed or not. Useful for setting sustain on or off.
  let someNoteIsDepressed = false;

  _.forEach($nextNotes, (value, key) => {
    if (!someNoteIsDepressed && value.depressed) {
      // if no note is depressed already (from a previous play) and the one we look at is depressed, set it:
      someNoteIsDepressed = true;
    }

    if (value.depressed && !$currentNotes[key].depressed) {
      // it the nextprops note is depressed, but it wasn't already, we can safely trigger it.
      $sampler[key].triggerAttack();
    } else if (!value.depressed && $currentNotes[key].depressed && !$sustain) {
      // if no longer depressed, but it was depressed before; AND if we're not sustaining -> kill the sample
      $sampler[key].triggerRelease();
    }
  });

  // kill all samplers if we're not pressing any notes & not in sustain mode.
  if (!someNoteIsDepressed && !$nextSustain) {
    for (let aKey in $sampler) {
      if (aKey) {
        $sampler[aKey].triggerRelease();
      }
    }
  }
}

export function handleMonophonicNoteTriggers($nextNotes, $currentNotes, $nextSustain, $sustain, $synth) {
  // if should get the last note played from nextNotes & trigger attack on that note
  // if the current playing note is different from the next note, it should kill the current note
  // if sustain is true, don't kill the note when its released

  let someNoteIsDepressed = false;

  _.forEach($nextNotes, (value, key) => {
    if (!someNoteIsDepressed && value.depressed) {
      // if no note is depressed already (from a previous play) and the one we look at is depressed, set it:
      someNoteIsDepressed = true;
      $synth.triggerAttack(key);
    }

    if (someNoteIsDepressed && value.depressed && !$currentNotes[key].depressed) {
      $synth.setNote(key);
    }
  });

  if (!someNoteIsDepressed && !$nextSustain) {
    $synth.triggerRelease();
  }
}


/******* common visual generators *******/

export function generatePianoKeyboard($notes) {
  const pianoNotes = Object.keys($notes);
  const whiteBlackNotesCount = _.countBy(pianoNotes, (pianoNote) => {
    return pianoNote[1] !== 'b';
  });
  const whiteNotesStyle = {
    width: (100 / whiteBlackNotesCount.true) + '%',
  };
  let pianoKeys = [];

  // build the keyboard.
  // we're drawing all white notes in a flex row on screen.
  // if the next note we're encountering is a flat note, we position it absolutely to the current white note

  for (let i = 0; i < pianoNotes.length; i ++) {
    let nextIsFlatNote;
    const currentNote = pianoNotes[i];
    const nextNote = pianoNotes[i + 1];

    const isFlatNote = currentNote[1] === 'b';

    if (nextNote) {
      nextIsFlatNote = nextNote[1] === 'b';
    }

    // set highlight classes on the correct keys,
    const pianoBlackClasses = classnames(
      'piano-black-key',
      {'piano-key-highlight': nextIsFlatNote && $notes[nextNote] && $notes[nextNote].depressed}
    );

    const pianoWhiteClasses = classnames(
      'piano-key',
      {'piano-key-highlight': $notes[currentNote].depressed}
    );

    const blackKey = nextIsFlatNote ? <div className={pianoBlackClasses}>{nextNote}</div> : null;

    if (!isFlatNote) {
      pianoKeys.push(
        <div key={currentNote} style={whiteNotesStyle} className={pianoWhiteClasses}>
          {currentNote}
          {blackKey}
        </div>
      );
    }
  }

  return pianoKeys;
}