// DOM Elements - Basic UI
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const themeCheckbox = document.getElementById('theme-checkbox');
const historyToggleBtn = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// DOM Elements - Standard Calculator
const numberButtons = document.querySelectorAll('.standard-grid .number-btn');
const operatorButtons = document.querySelectorAll('.standard-grid .operator-btn');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const leftBracketButton = document.getElementById('left-bracket');
const rightBracketButton = document.getElementById('right-bracket');

// DOM Elements - Scientific Calculator
const standardModeBtn = document.getElementById('standard-mode');
const scientificModeBtn = document.getElementById('scientific-mode');
const standardGrid = document.getElementById('standard-grid');
const scientificGrid = document.getElementById('scientific-grid');

// DOM Elements - Memory Functions
const memoryAddBtn = document.getElementById('memory-add');
const memorySubtractBtn = document.getElementById('memory-subtract');
const memoryRecallBtn = document.getElementById('memory-recall');
const memoryClearBtn = document.getElementById('memory-clear');
const memoryStoreBtn = document.getElementById('memory-store');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;
let bracketCount = 0;
let darkTheme = false;
let memoryValue = 0;
let calculationHistory = [];
let scientificMode = false;

// Mobile detection and optimization
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768);
}

// Initialize particles.js with mobile optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Apply mobile-specific optimizations
    if (isMobileDevice()) {
        // Reduce particle count on mobile for better performance
        particleCount = 30;
        particleSpeed = 1;
        
        // Fix the 100vh issue on mobile browsers
        function setMobileViewportHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        // Set initial viewport height and update on resize
        setMobileViewportHeight();
        window.addEventListener('resize', setMobileViewportHeight);
        
        // Prevent double-tap zoom on buttons
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
                // The click event will still fire
            });
        });
    } else {
        particleCount = 80;
        particleSpeed = 2;
    }
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": isMobileDevice() ? 30 : 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#00ADB5"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#00ADB5",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": isMobileDevice() ? 1 : 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": !isMobileDevice(), // Disable hover effect on mobile
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
});

// Functions
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    bracketCount = 0;
    updateDisplay();
}
function deleteNumber() {
    if (currentOperand === '0') return;
    
    // Check if we're deleting a bracket and update the bracket count
    if (currentOperand.slice(-1) === '(') bracketCount--;
    if (currentOperand.slice(-1) === ')') bracketCount++;
    
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function appendNumber(number) {
    if (resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    
    // Prevent multiple decimal points in a number
    if (number === '.' && /\d*\.\d*$/.test(currentOperand)) return;
    
    // Replace initial 0 unless it's followed by a decimal point
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    addButtonPressAnimation(event.target);
    updateDisplay();
}

function appendBracket(bracket) {
    if (resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    
    // Logic for opening bracket
    if (bracket === '(') {
        // If current operand is just 0, replace it
        if (currentOperand === '0') {
            currentOperand = '(';
        } 
        // If last character is a digit or closing bracket, add multiplication sign
        else if (/[\d)]$/.test(currentOperand)) {
            currentOperand += '×(';
        } else {
            currentOperand += '(';
        }
        bracketCount++;
    }
    // Logic for closing bracket
    else if (bracket === ')') {
        // Only add closing bracket if there are unclosed opening brackets
        if (bracketCount > 0 && !/[\+\-×÷(]$/.test(currentOperand)) {
            currentOperand += ')';
            bracketCount--;
        }
    }
    
    addButtonPressAnimation(event.target);
    updateDisplay();
}

function chooseOperation(op) {
    // Don't allow operators at the start except minus
    if (currentOperand === '0' && op !== '-') return;
    
    // Replace the current operation if the last character is an operator
    if (/[\+\-×÷]$/.test(currentOperand)) {
        currentOperand = currentOperand.slice(0, -1) + op;
    } else {
        currentOperand += op;
    }
    
    addButtonPressAnimation(event.target);
    updateDisplay();
}

function evaluateExpression(expression) {
    // Replace the multiplication and division symbols with their JavaScript equivalents
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    
    try {
        // Add missing closing brackets if needed
        while (bracketCount > 0) {
            expression += ')';
            bracketCount--;
        }
        
        // Use Function constructor to safely evaluate the expression
        const result = new Function('return ' + expression)();
        
        // Check if the result is valid
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        return result.toString();
    } catch (error) {
        console.error('Calculation error:', error);
        return 'Error';
    }
}

function compute() {
    // Don't compute if the expression ends with an operator or opening bracket
    if (/[\+\-×÷(]$/.test(currentOperand)) return;
    
    previousOperand = currentOperand;
    const result = evaluateExpression(currentOperand);
    
    if (result === 'Error') {
        currentOperand = 'Error';
        setTimeout(() => {
            clear();
        }, 1500);
    } else {
        currentOperand = result;
        bracketCount = 0; // Reset bracket count after computation
    }
    
    addButtonPressAnimation(event.target);
    updateDisplay();
}

function getDisplayNumber(number) {
    // If the number contains operators or brackets, don't format it
    if (/[\+\-×÷()]/.test(number)) return number;
    
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', {
            maximumFractionDigits: 0
        });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

function updateDisplay() {
    // For the current display, we don't format if it contains operators or brackets
    if (/[\+\-×÷()]/.test(currentOperand)) {
        currentOperandElement.textContent = currentOperand;
    } else {
        currentOperandElement.textContent = getDisplayNumber(currentOperand);
    }
    
    previousOperandElement.textContent = previousOperand;
}

function toggleTheme() {
    darkTheme = themeCheckbox.checked;
    document.body.classList.toggle('dark-theme', darkTheme);
    
    // Update particles color based on theme
    if (window.pJSDom && window.pJSDom[0]) {
        if (darkTheme) {
            // Light theme colors (checkbox is checked)
            window.pJSDom[0].pJS.particles.color.value = '#6C63FF';
            window.pJSDom[0].pJS.particles.line_linked.color = '#6C63FF';
        } else {
            // Dark theme colors (checkbox is unchecked)
            window.pJSDom[0].pJS.particles.color.value = '#00ADB5';
            window.pJSDom[0].pJS.particles.line_linked.color = '#00ADB5';
        }
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
}

function addButtonPressAnimation(button) {
    if (!button) return;
    button.classList.add('button-press');
    setTimeout(() => {
        button.classList.remove('button-press');
    }, 200);
}

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        appendNumber(button.textContent);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        chooseOperation(button.textContent);
    });
});

equalsButton.addEventListener('click', (event) => {
    compute();
});

clearButton.addEventListener('click', (event) => {
    addButtonPressAnimation(event.target);
    clear();
});

deleteButton.addEventListener('click', (event) => {
    addButtonPressAnimation(event.target);
    deleteNumber();
});

leftBracketButton.addEventListener('click', (event) => {
    appendBracket('(');
});

rightBracketButton.addEventListener('click', (event) => {
    appendBracket(')');
});

themeCheckbox.addEventListener('change', () => {
    toggleTheme();
});

// Add click effect to all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (event) => {
        addButtonPressAnimation(event.target);
    });
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') appendNumber(event.key);
    if (event.key === '.') appendNumber(event.key);
    if (event.key === '+') chooseOperation('+');
    if (event.key === '-') chooseOperation('-');
    if (event.key === '*') chooseOperation('×');
    if (event.key === '/') chooseOperation('÷');
    if (event.key === '(') appendBracket('(');
    if (event.key === ')') appendBracket(')');
    if (event.key === 'Enter' || event.key === '=') compute();
    if (event.key === 'Escape') clear();
    if (event.key === 'Backspace') deleteNumber();
    if (event.key === 't') {
        themeCheckbox.checked = !themeCheckbox.checked;
        toggleTheme();
    }
});

// History Functions
function toggleHistory() {
    historyPanel.classList.toggle('active');
    addButtonPressAnimation(historyToggleBtn);
}

function clearHistory() {
    calculationHistory = [];
    updateHistoryDisplay();
    addButtonPressAnimation(clearHistoryBtn);
}

function addToHistory(expression, result) {
    // Don't add if the result is an error
    if (result === 'Error') return;
    
    calculationHistory.unshift({
        expression: expression,
        result: result
    });
    
    // Limit history to 10 items
    if (calculationHistory.length > 10) {
        calculationHistory.pop();
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    calculationHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">${item.result}</div>
        `;
        
        // Add click event to reuse the calculation
        historyItem.addEventListener('click', () => {
            currentOperand = item.result;
            updateDisplay();
            historyPanel.classList.remove('active');
        });
        
        historyList.appendChild(historyItem);
    });
}

// Memory Functions
function memoryStore() {
    // Store current value in memory
    if (currentOperand !== 'Error') {
        memoryValue = parseFloat(evaluateExpression(currentOperand));
        addButtonPressAnimation(memoryStoreBtn);
    }
}

function memoryRecall() {
    // Recall memory value
    if (memoryValue !== null) {
        if (resetScreen) {
            currentOperand = memoryValue.toString();
            resetScreen = false;
        } else if (currentOperand === '0') {
            currentOperand = memoryValue.toString();
        } else {
            // If we're in the middle of an expression, we need to be careful
            if (/[\+\-×÷(]$/.test(currentOperand)) {
                currentOperand += memoryValue.toString();
            } else {
                currentOperand = memoryValue.toString();
            }
        }
        updateDisplay();
        addButtonPressAnimation(memoryRecallBtn);
    }
}

function memoryAdd() {
    // Add current value to memory
    if (currentOperand !== 'Error') {
        memoryValue += parseFloat(evaluateExpression(currentOperand));
        addButtonPressAnimation(memoryAddBtn);
    }
}

function memorySubtract() {
    // Subtract current value from memory
    if (currentOperand !== 'Error') {
        memoryValue -= parseFloat(evaluateExpression(currentOperand));
        addButtonPressAnimation(memorySubtractBtn);
    }
}

function memoryClear() {
    // Clear memory
    memoryValue = 0;
    addButtonPressAnimation(memoryClearBtn);
}

// Scientific Functions
function toggleCalculatorMode() {
    scientificMode = !scientificMode;
    
    if (scientificMode) {
        standardGrid.classList.add('inactive');
        scientificGrid.classList.add('active');
        standardModeBtn.classList.remove('active');
        scientificModeBtn.classList.add('active');
        
        // Add animation for smooth transition
        document.querySelector('.calculator').classList.add('scientific-mode');
        
        // Ensure all buttons are visible by scrolling to top
        setTimeout(() => {
            window.scrollTo(0, 0);
            scientificGrid.scrollTo(0, 0);
        }, 100);
    } else {
        standardGrid.classList.remove('inactive');
        scientificGrid.classList.remove('active');
        standardModeBtn.classList.add('active');
        scientificModeBtn.classList.remove('active');
        
        // Remove scientific mode class
        document.querySelector('.calculator').classList.remove('scientific-mode');
    }
}

function calculateSquare() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseFloat(evaluateExpression(currentOperand));
        previousOperand = `sqr(${currentOperand})`;
        currentOperand = (value * value).toString();
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function calculateCube() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseFloat(evaluateExpression(currentOperand));
        previousOperand = `cube(${currentOperand})`;
        currentOperand = (value * value * value).toString();
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function calculateSquareRoot() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseFloat(evaluateExpression(currentOperand));
        if (value < 0) {
            currentOperand = 'Error';
            updateDisplay();
            return;
        }
        previousOperand = `sqrt(${currentOperand})`;
        currentOperand = Math.sqrt(value).toString();
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function calculateCubeRoot() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseFloat(evaluateExpression(currentOperand));
        previousOperand = `cbrt(${currentOperand})`;
        currentOperand = Math.cbrt(value).toString();
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function calculateSin() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseFloat(evaluateExpression(currentOperand));
        previousOperand = `sin(${currentOperand})`;
        currentOperand = Math.sin(value * Math.PI / 180).toString(); // Convert to radians
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function calculateCos() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseFloat(evaluateExpression(currentOperand));
        previousOperand = `cos(${currentOperand})`;
        currentOperand = Math.cos(value * Math.PI / 180).toString(); // Convert to radians
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function calculateTan() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseFloat(evaluateExpression(currentOperand));
        previousOperand = `tan(${currentOperand})`;
        currentOperand = Math.tan(value * Math.PI / 180).toString(); // Convert to radians
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function calculateLog() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseFloat(evaluateExpression(currentOperand));
        if (value <= 0) {
            currentOperand = 'Error';
            updateDisplay();
            return;
        }
        previousOperand = `log(${currentOperand})`;
        currentOperand = Math.log10(value).toString();
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function calculateLn() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseFloat(evaluateExpression(currentOperand));
        if (value <= 0) {
            currentOperand = 'Error';
            updateDisplay();
            return;
        }
        previousOperand = `ln(${currentOperand})`;
        currentOperand = Math.log(value).toString();
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function calculateFactorial() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    try {
        const value = parseInt(evaluateExpression(currentOperand));
        if (value < 0 || !Number.isInteger(value)) {
            currentOperand = 'Error';
            updateDisplay();
            return;
        }
        
        let result = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        
        previousOperand = `fact(${currentOperand})`;
        currentOperand = result.toString();
        updateDisplay();
    } catch (error) {
        currentOperand = 'Error';
        updateDisplay();
    }
}

function insertPi() {
    if (resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    
    if (currentOperand === '0') {
        currentOperand = Math.PI.toString();
    } else if (/[\d)]$/.test(currentOperand)) {
        currentOperand += '×' + Math.PI.toString();
    } else {
        currentOperand += Math.PI.toString();
    }
    
    updateDisplay();
}

function insertE() {
    if (resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    
    if (currentOperand === '0') {
        currentOperand = Math.E.toString();
    } else if (/[\d)]$/.test(currentOperand)) {
        currentOperand += '×' + Math.E.toString();
    } else {
        currentOperand += Math.E.toString();
    }
    
    updateDisplay();
}

// Additional Event Listeners
// History
historyToggleBtn.addEventListener('click', toggleHistory);
clearHistoryBtn.addEventListener('click', clearHistory);

// Memory
memoryStoreBtn.addEventListener('click', memoryStore);
memoryRecallBtn.addEventListener('click', memoryRecall);
memoryAddBtn.addEventListener('click', memoryAdd);
memorySubtractBtn.addEventListener('click', memorySubtract);
memoryClearBtn.addEventListener('click', memoryClear);

// Calculator Mode
standardModeBtn.addEventListener('click', () => {
    if (scientificMode) toggleCalculatorMode();
});

scientificModeBtn.addEventListener('click', () => {
    if (!scientificMode) toggleCalculatorMode();
});

// Scientific Functions - Add event listeners to all scientific buttons
document.addEventListener('DOMContentLoaded', function() {
    // Scientific function buttons
    if (document.getElementById('square')) {
        document.getElementById('square').addEventListener('click', calculateSquare);
        document.getElementById('cube').addEventListener('click', calculateCube);
        document.getElementById('sqrt').addEventListener('click', calculateSquareRoot);
        document.getElementById('cbrt').addEventListener('click', calculateCubeRoot);
        document.getElementById('sin').addEventListener('click', calculateSin);
        document.getElementById('cos').addEventListener('click', calculateCos);
        document.getElementById('tan').addEventListener('click', calculateTan);
        document.getElementById('log').addEventListener('click', calculateLog);
        document.getElementById('ln').addEventListener('click', calculateLn);
        document.getElementById('factorial').addEventListener('click', calculateFactorial);
        document.getElementById('pi').addEventListener('click', insertPi);
        document.getElementById('e').addEventListener('click', insertE);
        document.getElementById('power').addEventListener('click', function() {
            appendNumber('^');
        });
        document.getElementById('mod').addEventListener('click', function() {
            appendNumber('%');
        });
        document.getElementById('exp').addEventListener('click', function() {
            appendNumber('E');
        });
    }
    
    // Scientific mode number buttons
    const sciNumberButtons = document.querySelectorAll('.scientific-grid .number-btn');
    sciNumberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.textContent);
            addButtonPressAnimation(button);
        });
    });
    
    // Scientific mode operator buttons
    const sciOperatorButtons = document.querySelectorAll('.scientific-grid .operator-btn');
    sciOperatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.textContent);
            addButtonPressAnimation(button);
        });
    });
    
    // Scientific mode bracket buttons
    if (document.getElementById('left-bracket-sci')) {
        document.getElementById('left-bracket-sci').addEventListener('click', () => {
            appendBracket('(');
            addButtonPressAnimation(document.getElementById('left-bracket-sci'));
        });
    }
    
    if (document.getElementById('right-bracket-sci')) {
        document.getElementById('right-bracket-sci').addEventListener('click', () => {
            appendBracket(')');
            addButtonPressAnimation(document.getElementById('right-bracket-sci'));
        });
    }
    
    // Scientific mode equals button
    if (document.getElementById('equals-sci')) {
        document.getElementById('equals-sci').addEventListener('click', () => {
            compute();
            addButtonPressAnimation(document.getElementById('equals-sci'));
        });
    }
    
    // Scientific mode clear and delete buttons
    if (document.getElementById('clear-sci')) {
        document.getElementById('clear-sci').addEventListener('click', () => {
            clear();
            addButtonPressAnimation(document.getElementById('clear-sci'));
        });
    }
    
    if (document.getElementById('delete-sci')) {
        document.getElementById('delete-sci').addEventListener('click', () => {
            deleteNumber();
            addButtonPressAnimation(document.getElementById('delete-sci'));
        });
    }
});

// Override compute function to add history
const originalCompute = compute;
compute = function() {
    const expressionToEvaluate = currentOperand;
    originalCompute();
    
    // Add to history if computation was successful
    if (currentOperand !== 'Error') {
        addToHistory(expressionToEvaluate, currentOperand);
    }
};

// Initialize
clear();
updateHistoryDisplay();