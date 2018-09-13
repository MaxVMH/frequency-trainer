/*jslint es6 */
/*jslint browser */
/*global window URLSearchParams*/

let toneContext = null;
let toneGenerator = null;
let toneAmplifier = null;

function createFrequencyTrainer(difficultyMode, previousFrequency) {
    'use strict';
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

function startToneGenerator(frequency, volumeControl, startTimer, stopTimer) {
    'use strict';
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
    'use strict';
    if (toneGenerator) {
        toneGenerator.disconnect();
    }
}

function changeFrequency(difficultyMode, previousFrequency) {
    'use strict';
    let frequencyTrainer = null;

    toneContext.close();
    frequencyTrainer = createFrequencyTrainer(difficultyMode, previousFrequency);

    return {
        frequency: frequencyTrainer.frequency
    };
}

function changeVolume(volumeControl) {
    'use strict';
    toneAmplifier.gain.value = volumeControl.value / 100;
}

function getFrequencies(difficultyMode) {
    'use strict';
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
    'use strict';
    let newFrequency = null;

    newFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    // Avoid giving the same frequency twice in a row
    while (newFrequency === previousFrequency) {
        newFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    }

    return newFrequency;
}

function getResult(frequencyChosen, frequencyCorrect) {
    'use strict';
    let result = false;

    if (frequencyChosen === frequencyCorrect) {
        result = true;
    }

    return result;
}

function frequencyFormatter(frequency) {
    'use strict';
    let frequencyFormatted = null;

    if (frequency > 999) {
        frequencyFormatted = frequency / 1000 + ' k';
    } else {
        frequencyFormatted = frequency + ' ';
    }

    return frequencyFormatted;
}

function getDifficultyMode() {
    'use strict';
    let urlParameters = new URLSearchParams(location.search);
    let difficultyMode = urlParameters.get('mode');

    if (!difficultyMode) {
        difficultyMode = 'easy';
    }

    return difficultyMode;
}
