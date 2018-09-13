/*jslint es6 */
/*jslint browser */
/*global window URLSearchParams*/

let toneContext = null;
let toneGenerator = null;
let toneAmplifier = null;

function createFrequencyTrainer(difficultyMode, previousRandomFrequency) {
    'use strict';
    let frequencies = null;
    let newRandomFrequency = null;
    let randomFrequency = null;

    let startButton = null;
    let stopButton = null;
    let nextButton = null;
    let volumeControl = null;

    let startTimer = null;
    let stopTimer = 3;

    // Create objects
    toneContext = new(window.AudioContext || window.webkitAudioContext)();
    toneAmplifier = toneContext.createGain();

    // Pick a frequency
    frequencies = getFrequencies(difficultyMode);
    newRandomFrequency = getRandomAndPreviousRandomFrequency(frequencies, previousRandomFrequency);
    randomFrequency = newRandomFrequency.randomFrequency;
    previousRandomFrequency = newRandomFrequency.previousRandomFrequency;

    // Control buttons
    startButton = document.getElementById("start-button");
    stopButton = document.getElementById("stop-button");
    nextButton = document.getElementById("next-button");
    volumeControl = document.getElementById("volume-control");

    startButton.onclick = function () {startToneGenerator(randomFrequency, startTimer, stopTimer);};
    stopButton.onclick = function () {stopToneGenerator();};
    nextButton.onclick = function () {changeFrequency(difficultyMode, previousRandomFrequency, startTimer, stopTimer);};
    volumeControl.oninput = function () {changeVolume(volumeControl);};

    // Set the gain volume
    toneAmplifier.gain.value = volumeControl.value / 100;

    return {
        frequencies,
        randomFrequency,
        startTimer,
        stopTimer
    };
}

function startToneGenerator(frequency, startTimer, stopTimer) {
    'use strict';
    stopToneGenerator();
    // Create and configure the oscillator
    toneGenerator = toneContext.createOscillator();
    toneGenerator.type = 'sine'; // could be sine, square, sawtooth or triangle
    toneGenerator.frequency.value = frequency;
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

function changeFrequency(difficultyMode, previousRandomFrequency, startTimer, stopTimer) {
    'use strict';
    let frequencyTrainer = null;
    stopToneGenerator();
    toneContext.close();
    frequencyTrainer = createFrequencyTrainer(difficultyMode, previousRandomFrequency);
    startTimer = 0.1;
    startToneGenerator(frequencyTrainer.randomFrequency, startTimer, stopTimer);
    return {
        frequency: frequencyTrainer.randomFrequency
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

function getRandomAndPreviousRandomFrequency(frequencies, previousRandomFrequency) {
    'use strict';
    let randomFrequency = null;
    randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    // Avoid giving the same frequency twice in a row
    while (randomFrequency === previousRandomFrequency) {
        randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    }
    window.console.log('previous frequency: ' + previousRandomFrequency + '\nnew frequency: ' + randomFrequency);
    previousRandomFrequency = randomFrequency;
    return {
        randomFrequency: randomFrequency,
        previousRandomFrequency: previousRandomFrequency
    };
}

function getResult(frequencyChosen, frequencyCorrect) {
    'use strict';
    let result = false;
    if (frequencyChosen === frequencyCorrect) {
        stopToneGenerator();
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
