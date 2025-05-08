(function(){
    const display = document.getElementById('display');
    const buttons = document.getElementById('buttons');
    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecond = false;

    function updateDisplay() {
      display.textContent = currentInput;
    }

    function clearAll() {
      currentInput = '0';
      firstOperand = null;
      operator = null;
      waitingForSecond = false;
      updateDisplay();
    }

    function inputDigit(digit) {
      if (waitingForSecond) {
        currentInput = digit;
        waitingForSecond = false;
      } else {
        if (currentInput === '0' && digit !== '.') {
          currentInput = digit;
        } else if (digit === '.' && currentInput.includes('.')) {
          return; // Prevent multiple decimals
        } else {
          currentInput += digit;
        }
      }
      updateDisplay();
    }

    function inputOperator(nextOperator) {
      const inputValue = parseFloat(currentInput);

      if (operator && waitingForSecond) {
        operator = nextOperator; // Change operator if pressed consecutively
        return;
      }

      if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
      } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        firstOperand = result;
        currentInput = String(result);
        updateDisplay();
      }

      operator = nextOperator;
      waitingForSecond = true;
    }

    function calculate(first, second, op) {
      switch(op) {
        case '+':
          return first + second;
        case '-':
          return first - second;
        case '*':
          return first * second;
        case '/':
          if (second === 0) {
            alert("Error: Division by zero");
            return first;
          }
          return first / second;
        default:
          return second;
      }
    }

    function handleEqual() {
      const inputValue = parseFloat(currentInput);
      if (operator && !waitingForSecond) {
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = String(result);
        firstOperand = null;
        operator = null;
        waitingForSecond = false;
        updateDisplay();
      }
    }

    buttons.addEventListener('click', event => {
      const target = event.target;
      if (!target.matches('button')) return;

      if (target.id === 'clear') {
        clearAll();
        return;
      }

      const digit = target.getAttribute('data-digit');
      const op = target.getAttribute('data-operator');

      if (digit !== null) {
        inputDigit(digit);
        return;
      }

      if (op !== null) {
        if (op === '=') {
          handleEqual();
        } else {
          inputOperator(op);
        }
        return;
      }

      if (target.id === 'equals') {
        handleEqual();
      }
    });

    // Keyboard support for convenience
    window.addEventListener('keydown', (e) => {
      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        e.preventDefault();
        inputDigit(e.key);
      }
      else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault();
        inputOperator(e.key);
      }
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEqual();
      }
      else if (e.key === 'Backspace') {
        e.preventDefault();
        if (currentInput.length > 1) {
          currentInput = currentInput.slice(0, -1);
        } else {
          currentInput = '0';
        }
        updateDisplay();
      }
      else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        clearAll();
      }
    });

    clearAll();
  })();
