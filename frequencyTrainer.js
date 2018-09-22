/*jslint es6 */
/*jslint browser */
/*global window URLSearchParams*/

'use strict';
let toneContext = null;
let toneGenerator = null;
let toneAmplifier = null;

function startFrequencyTrainer(difficultyMode, previousFrequency) {
    let frequencies = null;
    let frequency = null;

    // Create objects
    toneContext = new(window.AudioContext || window.webkitAudioContext)();
    toneAmplifier = toneContext.createGain();

    // Pick a frequency
    frequencies = getFrequencies(difficultyMode);
    frequency = getNewFrequency(frequencies, previousFrequency);

    return {
        frequencies,
        frequency
    };
}

function stopFrequencyTrainer() {
    toneContext.close();
}

function startToneGenerator(frequency, volumeControl, startTimer, stopTimer) {
    // Create and configure the oscillator
    toneGenerator = toneContext.createOscillator();
    toneGenerator.type = 'sine'; // could be sine, square, sawtooth or triangle
    toneGenerator.frequency.value = frequency;

    // Connect toneGenerator -> toneAmplifier -> output
    toneGenerator.connect(toneAmplifier);
    toneAmplifier.connect(toneContext.destination);

    // Set the gain volume
    toneAmplifier.gain.value = volumeControl.value / 100;

    // Fire up the toneGenerator
    toneGenerator.start(toneContext.currentTime + startTimer);
    toneGenerator.stop(toneContext.currentTime + startTimer + stopTimer);
}

function stopToneGenerator() {
    if (toneGenerator) {
        toneGenerator.disconnect();
    }
}

function changeVolume(volumeControl) {
    toneAmplifier.gain.value = volumeControl.value / 100;
}

function getFrequencies(difficultyMode) {
    let frequencies = null;

    if (difficultyMode === 'easy') {
        frequencies = ["250", "800", "2500", "8000"];
    } else if (difficultyMode === 'normal') {
        frequencies = ["100", "200", "400", "800", "1600", "3150", "6300", "12500"];
    } else if (difficultyMode === 'hard') {
        frequencies = ["80", "125", "160", "250", "315", "500", "630", "1000", "1250", "2000", "2500", "4000", "5000", "8000", "10000", "16000"];
    } else if (difficultyMode === 'pro') {
        frequencies = ["20", "25", "31.5", "40", "50", "63", "80", "100", "125", "160", "200", "250", "315", "400", "500", "630", "800", "1000", "1250", "1600", "2000", "2500", "3150", "4000", "5000", "6300", "8000", "10000", "12500", "16000", "20000"];
    }

    return frequencies;
}

function getNewFrequency(frequencies, previousFrequency) {
    let newFrequency = null;

    newFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    // Avoid getting the same frequency twice in a row
    while (newFrequency === previousFrequency) {
        newFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    }

    return newFrequency;
}

function frequencyFormatter(frequency) {
    let frequencyFormatted = null;

    if (frequency > 999) {
        frequencyFormatted = frequency / 1000 + ' k';
    } else {
        frequencyFormatted = frequency + ' ';
    }

    return frequencyFormatted;
}
