// Enable strict mode
"use strict";

function createRandomFrequency(range) {
  if(range == 'easy')
  {
    const frequencies = ["100", "400", "1600", "6300"];
    let frequency = frequencies[(Math.random() * frequencies.length) | 0];
    return frequency;
  }
};

function toneGenerator(frequency) {
  // Create objects
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = new AudioContext() || webkitAudioContext;
  const toneGenerator = audioCtx.createOscillator();
  const amplifier = audioCtx.createGain();

  toneGenerator.type = 'sine'; // could be sine, square, sawtooth or triangle
  toneGenerator.frequency.value = frequency;

  amplifier.gain.value = 0.2; // setting gain above 1 will clip

  // Connect toneGenerator -> amplifier -> output
  toneGenerator.connect(amplifier);
  amplifier.connect(audioCtx.destination);

  return {
    play(startIn = 0, playFor = 3) {
      audioCtx.resume();
      const now = audioCtx.currentTime;
      toneGenerator.start(now + startIn);
      toneGenerator.stop(now + startIn + playFor);

    },
    stop() {
      const now = audioCtx.currentTime;
      toneGenerator.stop(now);
    }
  };
}
