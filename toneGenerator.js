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
let stopTimer = 3;

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

  // Set the gain volume
  amplifier.gain.value = volumeControl.value/100;
};

function startToneGenerator() {
  // Create and configure the oscillator
  toneGenerator = audioCtx.createOscillator();
  toneGenerator.type = 'sine'; // could be sine, square, sawtooth or triangle
  toneGenerator.frequency.value = frequency;

  // Connect toneGenerator -> amplifier -> output
  toneGenerator.connect(amplifier);
  amplifier.connect(audioCtx.destination);

  // Fire up the toneGenerator
  toneGenerator.start(audioCtx.currentTime + startTimer);
  toneGenerator.stop(audioCtx.currentTime + startTimer + stopTimer);
};

function stopToneGenerator() {
  toneGenerator.disconnect();
};

function changeFrequency() {
  stopToneGenerator();
  audioCtx.close();
  createToneGenerator(difficultyLevel);
  startTimer = 0.1;
  startToneGenerator();
};

function changeVolume() {
  amplifier.gain.value = volumeControl.value/100;
};

function createRandomFrequency(range) {
  if(range == 'easy')
  {
    frequencies = ["250", "800", "2500", "8000"];
  }
  else if(range == 'normal')
  {
    frequencies = ["100", "200", "400", "800", "1600", "3150", "6300", "12500"];
  }
  else if(range == 'hard')
  {
    frequencies = ["25", "40", "63", "100", "160", "250", "400", "630", "1000", "1600", "2500", "4000", "6300", "10000", "16000"];
  }
  else if(range == 'pro')
  {
    frequencies = ["20", "25", "31.5", "40", "50", "63", "80", "100", "125", "160", "200", "250", "315", "400", "500", "630", "800", "1000", "1250", "1600", "2000", "2500", "3150", "4000", "5000", "6300", "8000", "10000", "12500", "16000", "20000"];
  }
  frequency = frequencies[(Math.random() * frequencies.length) | 0];
  return frequency;
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
  let numberAbbreviated = null;
  if(number > 999)
  {
    numberAbbreviated = number/1000 + 'K';
  }
  else
  {
    numberAbbreviated = number;
  }
  return numberAbbreviated;
};

function getDifficultyMode() {
  let urlParameters = new URLSearchParams(location.search);
  let difficultyMode = urlParameters.get('mode');
  if(!difficultyMode)
  {
    difficultyMode = 'normal';
  }
  return difficultyMode;
};
