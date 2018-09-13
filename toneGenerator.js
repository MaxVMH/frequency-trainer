/*jslint es6 */
/*jslint browser */
/*global window URLSearchParams*/

let toneContext = null;
let toneGenerator = null;
let toneAmplifier = null;

let startButton = null;
let stopButton = null;
let nextButton = null;
let volumeControl = null;

let randomFrequency = null;
let randomFrequencies = null;

function createFrequencyTrainer(difficultyMode, lastRandomFrequency) {
    'use strict';
    let frequencies = null;
    let newRandomFrequency = null;

    let startTimer = null;
    let stopTimer = 3;

    // Create objects
    toneContext = new(window.AudioContext || window.webkitAudioContext)();
    toneAmplifier = toneContext.createGain();

    // Pick a frequency
    frequencies = getFrequencies(difficultyMode);
    randomFrequencies = frequencies;

    newRandomFrequency = getRandomFrequency(frequencies, lastRandomFrequency);
    randomFrequency = newRandomFrequency.randomFrequency;
    lastRandomFrequency = newRandomFrequency.lastRandomFrequency;

    // Control buttons
    startButton = document.getElementById("start-button");
    stopButton = document.getElementById("stop-button");
    nextButton = document.getElementById("next-button");
    volumeControl = document.getElementById("volume-control");

    startButton.onclick = function () {startToneGenerator(startTimer, stopTimer);};
    stopButton.addEventListener('click', stopToneGenerator);
    nextButton.onclick = function () {changeFrequency(difficultyMode, lastRandomFrequency, startTimer, stopTimer);};
    volumeControl.addEventListener('input', changeVolume);

    // Set the gain volume
    toneAmplifier.gain.value = volumeControl.value / 100;

    return {
        startTimer, stopTimer
    };
}

function startToneGenerator(startTimer, stopTimer) {
    'use strict';
    stopToneGenerator();
    // Create and configure the oscillator
    toneGenerator = toneContext.createOscillator();
    toneGenerator.type = 'sine'; // could be sine, square, sawtooth or triangle
    toneGenerator.frequency.value = randomFrequency;

    // Connect toneGenerator -> toneAmplifier -> output
    toneGenerator.connect(toneAmplifier);
    toneAmplifier.connect(toneContext.destination);
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

function changeFrequency(difficultyMode, lastRandomFrequency, startTimer, stopTimer) {
    'use strict';
    stopToneGenerator();
    toneContext.close();
    createFrequencyTrainer(difficultyMode, lastRandomFrequency);
    startTimer = 0.1;
    startToneGenerator(startTimer, stopTimer);
}

function changeVolume() {
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

function getRandomFrequency(frequencies, lastRandomFrequency) {
    'use strict';
    randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    while (randomFrequency === lastRandomFrequency) {
        randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    }
    window.console.log('previous frequency: ' + lastRandomFrequency + '\nnew frequency: ' + randomFrequency);
    lastRandomFrequency = randomFrequency;
    return {
        randomFrequency: randomFrequency,
        lastRandomFrequency: lastRandomFrequency
    };
}

function getResult(frequencyChosen, frequencyCorrect) {
    'use strict';
    let result = null;
    if (frequencyChosen === frequencyCorrect) {
        stopToneGenerator();
        result = true;
    } else {
        result = false;
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
