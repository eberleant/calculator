let firstOperand;
let secondOperand;
let operator;
let clearOnNextNumber;
const display = document.querySelector('.display');
const numbers = Array.from(document.querySelectorAll('.number'));
const operators = Array.from(document.querySelectorAll('.operator'));
const equals = document.querySelector('.equals');
const clear = document.querySelector('.clear');
const del = document.querySelector('.delete');
const decimal = document.querySelector('.decimal');

numbers.forEach(num => num.addEventListener('click', e => appendCharToDisplay(e.target.textContent)));

operators.forEach(op => op.addEventListener('click', e => operatorClick(e.target.textContent)));

equals.addEventListener('click', () => {
	decimal.disabled = false;
	clearOnNextNumber = true;
	display.textContent = operate(operator, firstOperand, secondOperand);
	firstOperand = 0;
});

clear.addEventListener('click', clearAll);

del.addEventListener('click', () => display.textContent = display.textContent.slice(0, display.textContent.length - 1));

decimal.addEventListener('click', () => {
	appendCharToDisplay('.');
	decimal.disabled = true;
})

window.addEventListener('keydown', pressButton);

function pressButton(e) {
	if (((e.keyCode === 56 || e.keyCode === 187) && e.shiftKey) || e.keyCode === 189 || e.keyCode === 191) { //operator
		operatorClick(e.key);
	} else if (e.keyCode >= 48 && e.keyCode <= 57) { //number (already checked for *)
		appendCharToDisplay(e.key);
	} else if (e.keyCode === 8) { //delete triggered by backspace
		del.click();
	} else if (e.keyCode === 187 || e.keyCode === 13) { //equals triggered by = or enter
		equals.click();
	} else if (e.keyCode === 190) { //decimal triggered by period
		decimal.click();
	} else if (e.keyCode === 27) { //clear triggered by escape
		clear.click();
	}
}

function appendCharToDisplay(number) {
	if (clearOnNextNumber) {
		display.textContent = '';
	}
	display.textContent += number;
	if (firstOperand) {
		secondOperand = display.textContent;
	}
	clearOnNextNumber = false;
}

function operatorClick(opClicked) {
	if (firstOperand) {
		firstOperand = operate(operator, firstOperand, secondOperand);
	}else {
		firstOperand = display.textContent;
	}
	decimal.disabled = false;
	clearOnNextNumber = true;
	operator = opClicked;
}

function clearAll() {
	firstOperand = '';
	operator = '';
	display.textContent = '';
	decimal.disabled = false;
	clearOnNextNumber = true;
}

function add(x, y) {
	return x + y;
}

function subtract(x, y) {
	return x - y;
}

function multiply(x, y) {
	return x * y;
}

function divide(x, y) {
	if (y === 0) {
		clearAll();
		return 'LOL, nice try! ;)';
	}
	return x / y;
}

function operate(operator, x, y) {
	if (!x) x = 0;
	if (!y) y = 0;
	switch(operator) {
		case '+': return add(+x, +y);
		case '-': return subtract(+x, +y);
		case '*': return multiply(+x, +y);
		case '/': return divide(+x, +y);
		default: return y; //no operator
	}
}