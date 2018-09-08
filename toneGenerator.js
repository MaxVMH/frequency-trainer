// Enable strict mode
"use strict";

let audioCtx = null;
let toneGenerator = null;
let amplifier = null;

let startButton = null;
let stopButton = null;
let nextButton = null;
let volumeControl = null;

let now = null;
let volumeLevel = null;
let startTimer = null;

let difficultyLevel = null;
let frequency = null;
let frequencies = null;
let oldFrequency = null;
let newFrequency = null;

function createToneGenerator(difficulty) {
  // Create objects
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  amplifier = audioCtx.createGain();

  // Pick a frequency
  difficultyLevel = difficulty;
  frequency = createRandomFrequency(difficultyLevel);

  // Control buttons
  startButton = document.getElementById("start-button");
  stopButton = document.getElementById("stop-button");
  volumeControl = document.getElementById("volume-control");
  nextButton = document.getElementById("next-button");

  startButton.addEventListener('click', startToneGenerator);
  stopButton.addEventListener('click', stopToneGenerator);
  nextButton.addEventListener('click', changeFrequency);
  volumeControl.addEventListener('input', changeVolume);


  amplifier.gain.value = volumeControl.value/50;
};

function startToneGenerator() {
  toneGenerator = audioCtx.createOscillator();
  toneGenerator.type = 'sine'; // could be sine, square, sawtooth or triangle
  toneGenerator.frequency.value = frequency;

  // Connect toneGenerator -> amplifier -> output
  toneGenerator.connect(amplifier);
  amplifier.connect(audioCtx.destination);
  toneGenerator.start(audioCtx.currentTime + startTimer);
  toneGenerator.stop(audioCtx.currentTime + startTimer + 3);
};

function stopToneGenerator() {
  toneGenerator.disconnect()
};

function changeFrequency() {
  toneGenerator.disconnect();
  audioCtx.close();

  oldFrequency = frequency;
  newFrequency = createRandomFrequency(difficultyLevel);

  if(oldFrequency == newFrequency)
  {
    newFrequency = createRandomFrequency(difficultyLevel);
  }

  frequency = newFrequency;

  createToneGenerator(difficultyLevel);
  startTimer = 0.1;
  startToneGenerator();
};

function changeVolume() {
  amplifier.gain.value = volumeControl.value/50;
};

function createRandomFrequency(range) {
  if(range == 'easy')
  {
    frequencies = ["100", "400", "1600", "6300"];
    frequency = frequencies[(Math.random() * frequencies.length) | 0];
    return frequency;
  }
};

function showResult(frequencyChosen, frequencyCorrect) {
  let numberAbbreviated = numberAbbreviator(frequencyChosen);
  if(frequencyChosen == frequencyCorrect)
  {
    stopToneGenerator();
    if(confirm(numberAbbreviated + 'Hz is correct!\nLet\'s try another one!'))
    {
      changeFrequency();
    }
  }
  else
  {
    alert(numberAbbreviated + 'Hz is not correct.\nPlease try again.');
  }
};

function numberAbbreviator(number) {
  if(number == 100)
  {
    return '100 ';
  }
  if(number == 400)
  {
    return '400 ';
  }
  if(number == 1600)
  {
    return '1.6 k';
  }
  if(number == 6300)
  {
    return '6.3 k';
  }
};
