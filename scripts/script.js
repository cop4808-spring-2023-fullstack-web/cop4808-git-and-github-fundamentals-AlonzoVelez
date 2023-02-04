let displayValue = "0";
let firstOperand = null;
let secondOperand = null;
let firstOperator = null;
let secondOperator = null;
let result = null;
const buttons = document.querySelectorAll("button");
console.log("Amount of buttons is:", buttons.length);

window.addEventListener("keydown", function (e) {
  const key = document.querySelector(`button[data-key='${e.keyCode}']`);
  key.click();
});


//Update Display Function
//1. Changes the display to the current displayValue
//2. Checks to see if the string is longer than 9 characters
//3. Modifies string if longer than 9 characters
function updateDisplay() {
  console.log("Inside updateDisplay displayValue is: ", displayValue);
  const display = document.getElementById("display");
  display.innerText = displayValue;
  if (displayValue.length > 9) {
    //If the string is longer than 9 characters and it includes an exponential expression the 
    //string is shortened to 6 characters and the exponential is shown to the user
    if (displayValue.indexOf("e") != -1) {
      console.log("Inside of updateDisplay if statement");
      let index = displayValue.indexOf("e");
      let lastCharacters = displayValue.substring(index);
      display.innerText = displayValue.substring(0, 6) + lastCharacters;
    } 
    //Else if the string is longer than nine characters it is simply kept at 9 characters
    else {
      console.log("Outside of updateDisplay if statment: ");
      display.innerText = displayValue.substring(0, 9);
    }
  }
  console.log("Display Value is: ", displayValue);
}

updateDisplay();

//clickButton Function
//1. Adds EventListeners to every button based of class and calls associated function and updateDisplay function
function clickButton() {
  console.log("Inside clickButton");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      if (buttons[i].classList.contains("operand")) {
        inputOperand(buttons[i].value);
        updateDisplay();
      } else if (buttons[i].classList.contains("operator")) {
        inputOperator(buttons[i].value);
      } else if (buttons[i].classList.contains("equals")) {
        inputEquals();
        updateDisplay();
      } else if (buttons[i].classList.contains("decimal")) {
        inputDecimal(buttons[i].value);
        updateDisplay();
      } else if (buttons[i].classList.contains("percent")) {
        inputPercent(displayValue);
        updateDisplay();
      } else if (buttons[i].classList.contains("sign")) {
        inputSign(displayValue);
        updateDisplay();
      } else if (buttons[i].classList.contains("sin")) {
        inputSin(displayValue);
        updateDisplay();
      } else if (buttons[i].classList.contains("cos")) {
        inputCos(displayValue);
        updateDisplay();
      } else if (buttons[i].classList.contains("tan")) {
        inputTan(displayValue);
        updateDisplay();
      } else if (buttons[i].classList.contains("clear")) clearDisplay();
      updateDisplay();
    });
  }
}

clickButton();

//inputOperand Function
//Handles Operands or digits
function inputOperand(operand) {
  console.log("Operand in inputOperand function is:", operand);
  console.log("Display value inside inputOperand is: ", displayValue);
  console.log("First operand is: ", firstOperand);
  if (firstOperator === null) {
    if (displayValue === "0" || displayValue === 0) {
      //1st click - handles first operand input
      displayValue = operand;
    } else if (displayValue === firstOperand) {
      //starts new operation after inputEquals()
      console.log("Inside displayValue === firstOperand");
      displayValue = operand;
    } else {
      displayValue += operand;
    }
  } else {
    //3rd/5th click - inputs to secondOperand
    if (displayValue === firstOperand) {
      displayValue = operand;
    } else {
      displayValue += operand;
    }
  }
}

//inputOperator
//Handles Operators like +, -, /, *
function inputOperator(operator) {
  console.log("Inside inputOperator");
  console.log("firstOperator is: ", firstOperator);
  console.log("secondOperator is: ", secondOperator);
  if (firstOperator != null && secondOperator === null) {
    //4th click - handles input of second operator
    secondOperator = operator;
    secondOperand = displayValue;
    result = operate(
      Number(firstOperand),
      Number(secondOperand),
      firstOperator
    );
    displayValue = roundAccurately(result, 15).toString();
    firstOperand = displayValue;
    result = null;
  } else if (firstOperator != null && secondOperator != null) {
    //6th click - new secondOperator
    secondOperand = displayValue;
    result = operate(
      Number(firstOperand),
      Number(secondOperand),
      secondOperator
    );
    secondOperator = operator;
    displayValue = roundAccurately(result, 15).toString();
    firstOperand = displayValue;
    result = null;
  } else {
    //2nd click - handles first operator input
    firstOperator = operator;
    firstOperand = displayValue;
  }
}


//inputEquals
//When user presses equals key perform all operator functions with the operands given by the user solving the equation
function inputEquals() {
  console.log("Inside inputEquals");
  //hitting equals doesn't display undefined before operate()
  if (firstOperator === null) {
    displayValue = displayValue;
  } else if (secondOperator != null) {
    //handles final result
    secondOperand = displayValue;
    result = operate(
      Number(firstOperand),
      Number(secondOperand),
      secondOperator
    );
    if (result === "lmao") {
      displayValue = "lmao";
    } else {
      displayValue = roundAccurately(result, 15).toString();
      firstOperand = displayValue;
      secondOperand = null;
      firstOperator = null;
      secondOperator = null;
      result = null;
    }
  } else {
    //handles first operation
    secondOperand = displayValue;
    result = operate(
      Number(firstOperand),
      Number(secondOperand),
      firstOperator
    );
    if (result === "lmao") {
      displayValue = "lmao";
    } else {
      displayValue = roundAccurately(result, 15).toString();
      firstOperand = displayValue;
      secondOperand = null;
      firstOperator = null;
      secondOperator = null;
      result = null;
    }
  }
}

//inputDecimal
//Inputs a decimal to the display unless one is already present.
function inputDecimal(dot) {
  console.log("Inside inputDecimal");
  if (displayValue === firstOperand || displayValue === secondOperand) {
    //displayValue = '0';
    displayValue += dot;
  } else if (!displayValue.includes(dot)) {
    displayValue += dot;
  }
}

//inputPercent
//Divides the current value by 100 to gather the percentage value in decimal of the display
function inputPercent(num) {
  console.log("Inside inputPercent");
  displayValue = (num / 100).toString();
}

//inputSign
//Changes the sign of the current displayed value from positive to negative or vice versa
function inputSign(num) {
  console.log("Inside inputSign");
  displayValue = (num * -1).toString();
}

//inputSin
//Changes the current displayed value to a sine representation in radians
function inputSin(num) {
  console.log("Inside inputSin");
  const angleInRadians = num * (Math.PI / 180);
  const sinOfAngle = Math.sin(angleInRadians);
  displayValue = sinOfAngle.toString();
}

//inputCos
//Changes the current displayed value to a cosine representation in radians
function inputCos(num) {
  console.log("Inside inputCos");
  const angleInRadians = num * (Math.PI / 180);
  const sinOfAngle = Math.cos(angleInRadians).toFixed(7);
  displayValue = sinOfAngle.toString();
}

//inputTan
//Changes the current displayed value to a tangent representation in radians.
function inputTan(num) {
  console.log("Inside inputCos");
  if (num === "90" || num === "180" || num === "270" || num === "360") {
    displayValue = "Undefined";
  } else if (num === "45" || num === "135" || num === "225" || num === "315") {
    displayValue = "1";
  } else {
    const angleInRadians = num * (Math.PI / 180);
    const sinOfAngle = Math.tan(angleInRadians);
    displayValue = sinOfAngle.toString();
  }
}

//clearDisplay
//Clears all values, operators, and operands from the display
function clearDisplay() {
  console.log("Inside clearDisplay");
  displayValue = "0";
  firstOperand = null;
  secondOperand = null;
  firstOperator = null;
  secondOperator = null;
  result = null;
}

//inputBackspace
//Nonfunctional
function inputBackspace() {
  console.log("Inside inputBackspace");
  if (firstOperand != null) {
    firstOperand = null;
    updateDisplay();
  }
}

//operate
//Performs appropriate operator function on given operands based off given operator
function operate(x, y, op) {
  console.log("Inside operate");
  if (op === "+") {
    return x + y;
  } else if (op === "-") {
    return x - y;
  } else if (op === "*") {
    return x * y;
  } else if (op === "/") {
    if (y === 0) {
      return "lmao";
    } else {
      return x / y;
    }
  } else if (op === "^") {
    return x ** y;
  }
}

//roundAccurately
//Rounds the calculations
function roundAccurately(num, places) {
  console.log("Inside roundAccurately");
  return parseFloat(Math.round(num + "e" + places) + "e-" + places);
}
