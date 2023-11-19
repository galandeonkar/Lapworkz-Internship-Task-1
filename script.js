let lastInputIsOperator = false;
let validPutOperator = false;
const output = document.querySelector('.resultCalc');
const outputContainer = document.getElementById('result');
const defaultFontSize = 30;

function resize_to_fit() {
  let fontSize = defaultFontSize;
  while (output.clientHeight > outputContainer.clientHeight && fontSize > 10) {
    fontSize--;
    output.style.fontSize = fontSize + 'px';
  }
}

output.addEventListener('input', resize_to_fit);
function appendTrigonometric(trigFunction) {

  const resultContainer = document.querySelector('.resultCalc');
  resultContainer.innerHTML += trigFunction + ' ' + '(';
  lastInputIsOperator = false;
  validPutOperator = false;
}
function appendOperation(operation) {
  if (!validPutOperator && operation === ' * ' ||
    operation === ' / ' || operation === '%')
    return;
  if (
    operation === ' . ' ||
    operation === ' + ' ||
    operation === ' - ' ||
    operation === ' * ' ||
    operation === ' / ' ||
    operation === '%'
  ) {
    if (lastInputIsOperator) {
      const resultContainer = document.querySelector('.resultCalc');
      resultContainer.innerHTML =
        resultContainer.innerHTML.slice(0, -3) + operation;
    } else {
      lastInputIsOperator = true;
      document.querySelector('.resultCalc').innerHTML += operation;
    }
  } else {
    lastInputIsOperator = false;
    validPutOperator=true;
    document.querySelector('.resultCalc').innerHTML += operation;
  }
  resize_to_fit();
}
function appendFunction(functionName) {
  if (functionName === '^' && !validPutOperator)
    return;
  const resultContainer = document.querySelector('.resultCalc');
  resultContainer.innerHTML += functionName + '(';
  lastInputIsOperator = true;
}
function appendDecimal(decimal) {

  let presentOperators = "";
  let numbersI = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  for (let i = 0; i < output.innerText.length; i++) {
    if (!numbersI.includes(output.innerText[i])) {
      presentOperators += output.innerText[i];

    }

  }
  lastInputIsOperator = presentOperators[presentOperators.length - 1] == "."

  if (!lastInputIsOperator) {
    lastInputIsOperator = false;

    document.querySelector('.resultCalc').innerHTML += decimal;
  }
}
function addClothingParenthesis(expression) {
  const openParenCount = (expression.match(/\(/g) || []).length;
  const closeParenCount = (expression.match(/\)/g) || []).length;
  if (openParenCount > closeParenCount) {
    expression += ')'.repeat(openParenCount - closeParenCount);
  }
  return expression;
}
function calculateResult() {
  const previousExpressionContainer =
    document.getElementById('previousExpression');
  const resultContainer = document.querySelector('.resultCalc');

  let expression = resultContainer.innerHTML;

  if (expression.split("").length === 0) {
    return;
  }

  previousExpressionContainer.innerHTML = expression;
  expression = expression.replace('π', 'pi');
  expression = expression.replace('√', 'sqrt');
  expression = addClothingParenthesis(expression);
  console.log(expression);
  let result = math.compile(expression).evaluate();
  resultContainer.innerHTML = result.toString();
  resize_to_fit();
}

function deleteLast() {
  let container = document.querySelector('.resultCalc');
  if (container.innerHTML.endsWith(' ')) {
    container.innerHTML = container.innerHTML.slice(0, -3);
  } else {
    container.innerHTML = container.innerHTML.slice(0, -1);
  }
  let fontSize = parseFloat(window.getComputedStyle(output).fontSize);
  const maxFontSize = 30;
  if (fontSize < maxFontSize) {
    fontSize++;
    output.style.fontSize = fontSize + 'px';
  }
}

function clearResult() {
  let container = document.querySelector('.resultCalc');
  container.innerHTML = container.innerHTML.slice(0, 0);
  output.style.fontSize = '30px';
  validPutOperator=false;
}

let previous_key;

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/F[1-9.]/.test(key)) {
    return;
  }
  
  if (key === '%') {
    appendOperation(' % ');
  } else if (key === 'e') {
    appendOperation('e');
  } else if (key === '^') {
    appendFunction('^');
  } else if (previous_key === "s" && key === 'p') { 
    appendFunction('&#8730;');
    event.preventDefault(); 
  } else if (previous_key === "p" && key === "i") {
    appendOperation('π');
    event.preventDefault();
      
  } else if (/[0-9.]/.test(key)) {
    appendOperation(key);
  } else if (/[+\-*/]/.test(key)) {
    appendOperation(` ${key} `);
  } else if (key === 'Backspace' || key === 'Delete') {
    deleteLast();
  } else if (key === 'Enter' || key === '=') {
    calculateResult();
  }

  previous_key = key;
});

document.addEventListener('keydown', function (event) {
  if ((event.keyCode === 8 || event.keyCode === 46) && event.ctrlKey) {
    clearResult();
  }
});