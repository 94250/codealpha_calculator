// Beginner-friendly variable names
let inputText = '';
let answerText = '';
let previousAnswer = '';
let justPressedEqual = false;

let inputElement = document.getElementById('userInput');
let outputElement = document.getElementById('output');
let allButtons = document.querySelectorAll('.btn');
let calculatorDiv = document.querySelector('.calculator-container');

// Button click events
allButtons.forEach(function(oneButton) {
    oneButton.addEventListener('click', function() {
        let buttonVal = oneButton.dataset.value;
        let buttonAction = oneButton.dataset.action;
        if (buttonAction === 'clear') {
            clearCalculator();
        } else if (buttonAction === 'del') {
            deleteLast();
        } else if (buttonAction === 'equal') {
            showResult(true);
        } else if (buttonVal) {
            addToInput(buttonVal);
        }
    });
});

function clearCalculator() {
    inputText = '';
    answerText = '';
    previousAnswer = '';
    inputElement.textContent = '';
    outputElement.textContent = '';
    justPressedEqual = false;
}

function deleteLast() {
    if (justPressedEqual && previousAnswer) {
        inputText = previousAnswer;
        justPressedEqual = false;
    }
    inputText = inputText.slice(0, -1);
    inputElement.textContent = inputText;
    showResult();
}

function addToInput(char) {
    if (justPressedEqual) {
        // Start new calculation after equal if input is a number or dot
        if (/\d|\./.test(char)) {
            inputText = '';
        }
        justPressedEqual = false;
    }
    // Prevent adding two operators in a row
    if (/[+\-*/]/.test(char) && /[+\-*/]$/.test(inputText)) {
        inputText = inputText.slice(0, -1);
    }

    // Don't allow multiple leading zeros
    if (char === '0' && /^0$/.test(inputText)) return;
    // Don't allow more than one dot after a number
    if (char === '.' && inputText.endsWith('.')) return;

    if (char === '.') {
        let splitNumbers = inputText.split(/[+\-*/]/);
        if (splitNumbers[splitNumbers.length - 1].includes('.')) return;
        if (inputText === '') inputText += '0';
    }

    inputText += char;
    inputElement.textContent = inputText;
    showResult();
}

// Calculate and display result
function showResult(isFinal = false) {
    let resultText = '';
    let finalInput = inputText.replace(/×/g, '*').replace(/÷/g, '/');
    try {
        if (finalInput && /[0-9)]$/.test(finalInput)) {
            resultText = Function(`'use strict';return (${finalInput})`)();
        }
    } catch (err) {
        resultText = '';
    }
    if (resultText !== '' && !isNaN(resultText)) {
        outputElement.textContent = resultText;
        if (isFinal) {
            inputText = '';
            justPressedEqual = true;
            previousAnswer = resultText + '';
            inputElement.textContent = '';
        }
    } else {
        outputElement.textContent = '';
        if (isFinal) {
            outputElement.textContent = 'Error';
            inputText = '';
            justPressedEqual = true;
        }
    }
}

// Keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === '=') {
        showResult(true);
        e.preventDefault();
    } else if (e.key === 'Backspace') {
        deleteLast();
        e.preventDefault();
    } else if (e.key.toLowerCase() === 'c') {
        clearCalculator();
        e.preventDefault();
    } else if (/[0-9+\-*/.]/.test(e.key)) {
        addToInput(e.key);
        e.preventDefault();
    }
});

// Make calculator focusable for keyboard
calculatorDiv.tabIndex = 0;
calculatorDiv.focus();
