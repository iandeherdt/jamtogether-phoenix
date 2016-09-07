function initializeNotes(notes) {
  let notesObject = {};
  _.forEach(notes, (note) => {
    notesObject[note] = {
      depressed: false,
      velocity: 100
    };
  });

  return notesObject;
}

const notes = [
  // 'A0',
  // 'Ab0',
  // 'B0',

  // 'C1',
  // 'Db1',
  // 'D1',
  // 'Eb1',
  // 'E1',
  // 'F1',
  // 'Gb1',
  // 'G1',
  // 'Ab1',
  // 'A1',
  // 'Bb1',
  // 'B1',

  // 'C2',
  // 'Db2',
  // 'D2',
  // 'Eb2',
  // 'E2',
  // 'F2',
  // 'Gb2',
  // 'G2',
  // 'Ab2',
  // 'A2',
  // 'Bb2',
  // 'B2',

  'C3',
  'Db3',
  'D3',
  'Eb3',
  'E3',
  'F3',
  'Gb3',
  'G3',
  'Ab3',
  'A3',
  'Bb3',
  'B3',

  'C4',
  'Db4',
  'D4',
  'Eb4',
  'E4',
  'F4',
  'Gb4',
  'G4',
  'Ab4',
  'A4',
  'Bb4',
  'B4',

  // 'C5',
  // 'Db5',
  // 'D5',
  // 'Eb5',
  // 'E5',
  // 'F5',
  // 'Gb5',
  // 'G5',
  // 'Ab5',
  // 'A5',
  // 'Bb5',
  // 'B5',
];

const notesObject = initializeNotes(notes);
export default notesObject;
