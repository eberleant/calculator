let firstOperand;
let secondOperand;
let operator;
let clearNext = false;
const display = document.querySelector('.display');
const leftSide = display.querySelector('.leftSide');
const rightSide = display.querySelector('.rightSide');
const numbers = Array.from(document.querySelectorAll('.number'));
const operators = Array.from(document.querySelectorAll('.operator'));
const equals = document.querySelector('.equals');
const clear = document.querySelector('.clear');
const del = document.querySelector('.delete');
const decimal = document.querySelector('.decimal');

numbers.forEach(num => num.addEventListener('click', e => appendCharToDisplay(e.target.textContent)));

operators.forEach(op => op.addEventListener('click', e => operatorClick(e.target.textContent)));

equals.addEventListener('click', () => {
	if (!firstOperand || !secondOperand) return;
	firstOperand = operate(operator, firstOperand, secondOperand);
	rightSide.textContent = firstOperand;
	firstOperand = '';
	secondOperand = '';
	updateLeft('');
	clearNext = true;
});

clear.addEventListener('click', clearAll);

del.addEventListener('click', () => {
	if (rightSide.textContent) {
		rightSide.textContent = rightSide.textContent.slice(0, rightSide.textContent.length - 1);
		secondOperand = rightSide.textContent;
	} else if (operator) {
		updateLeft('');
	} else {
		leftSide.textContent = leftSide.textContent.slice(0, leftSide.textContent.length - 1);
		firstOperand = leftSide.textContent;
	}
});

decimal.addEventListener('click', () => {
	if (!isNaN(rightSide.textContent + '.')) {
		appendCharToDisplay('.');
	}
})

window.addEventListener('keydown', pressButton);

function pressButton(e) {
	if (((e.keyCode === 56 || e.keyCode === 187) && e.shiftKey) || ((e.keyCode === 189 || e.keyCode === 191) && !e.shiftKey)) { //operator
		operatorClick(e.key);
	} else if (e.keyCode >= 48 && e.keyCode <= 57 && !e.shiftKey) { //number (already checked for *)
		appendCharToDisplay(e.key);
	} else if (e.keyCode === 8) { //delete triggered by backspace
		del.click();
	} else if (e.keyCode === 187 || e.keyCode === 13) { //equals triggered by = or enter (already checked for +)
		e.preventDefault();
		equals.click();
	} else if (e.keyCode === 190 && !e.shiftKey) { //decimal triggered by period
		decimal.click();
	} else if (e.keyCode === 27) { //clear triggered by escape
		clear.click();
	}
}

function appendCharToDisplay(char) {
	if (!isNaN(leftSide.textContent) && leftSide.textContent !== '') { //no operator and not blank
		if (leftSide.offsetWidth >= .9 * display.offsetWidth) return;
		leftSide.textContent += char;
		firstOperand = leftSide.textContent;
		return;
	}

	if (rightSide.offsetWidth >= .9 * display.offsetWidth) return;
	if (clearNext) {
		clearAll();
		clearNext = false;
	}
	rightSide.textContent += char;
	if (firstOperand) {
		secondOperand = rightSide.textContent;
	}
}

function operatorClick(opClicked) {
	if (operator) {
		//if there is already an operator, do nothing (unless '-'); do nothing also if the right side is not a number (it could be '-')
		if ((opClicked !== '-' && (rightSide.textContent === '') || isNaN(rightSide.textContent))) return;
		else if (rightSide.textContent === '') { //negative number
			appendCharToDisplay('-');
			return;
		}
	}

	if (firstOperand && secondOperand) { //chain of operations 
		firstOperand = operate(operator, firstOperand, secondOperand);
		secondOperand = '';
	} else if (rightSide.textContent === '' && !firstOperand) { //if there is no first operand, default = 0
		firstOperand = '0';
	} else if (!firstOperand) { //transfer rightSide to firstOperand
		firstOperand = rightSide.textContent;
	}
	rightSide.textContent = '';
	updateLeft(opClicked);
	clearNext = false;
}

function clearAll() {
	firstOperand = '';
	updateLeft('');
	rightSide.textContent = '';
}

function updateLeft(op) {
	operator = op;
	leftSide.textContent = firstOperand + op;
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
	if (!x) {
		x = 0;
	}
	if (!y) {
		y = 0;
	}

	switch(operator) {
		case '+': return add(+x, +y).toString();
		case '-': return subtract(+x, +y).toString();
		case '*': return multiply(+x, +y).toString();
		case '/': return divide(+x, +y).toString();
		default: return rightSide.textContent; //no operator, so no change
	}
}