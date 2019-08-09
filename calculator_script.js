//allow . instead of 0.; make left side -> right side when being edited, add "e", add power
let firstOperand;
let operator;
//set to true after pressing '=', so that the next number pressed starts its own number (rather than adding onto the prev answer)
let clearNext = false;
const display = document.querySelector('.display');
const leftSide = display.querySelector('.leftSide'); //smaller text displaying stored number (aka first operand) and operator
const rightSide = display.querySelector('.rightSide'); //larger text displaying number currently being edited
const numbers = Array.from(document.querySelectorAll('.number')); //number buttons
const operators = Array.from(document.querySelectorAll('.operator')); //operator buttons
const equals = document.querySelector('.equals'); //equals button
const clear = document.querySelector('.clear'); //clear button
const del = document.querySelector('.delete'); //delete button
const decimal = document.querySelector('.decimal'); //decimal point button
//when a number button is pressed, append it to the display
numbers.forEach(num => num.addEventListener('click', e => appendCharToDisplay(e.target.textContent)));
//when an operator button is pressed, append the operator
operators.forEach(op => op.addEventListener('click', e => appendOperator(e.target.textContent)));
//when equals is pressed, evaluate the answer based on the first operand, second operand, and operator
equals.addEventListener('click', evaluate);
//when clear is pressed, all stored information is reset
clear.addEventListener('click', clearAll);
//when delete is pressed, find the right-most section with characters and delete from it
del.addEventListener('click', () => {
	clearNext = false;
	if (rightSide.textContent) {
		rightSide.textContent = rightSide.textContent.slice(0, rightSide.textContent.length - 1);
	} else if (operator) { //transfer left side to right side if operator is deleted
		updateLeft('');
		rightSide.textContent = leftSide.textContent;
		leftSide.textContent = '';
	}
});
//when decimal is pressed, check if it would be a valid number before appending
decimal.addEventListener('click', () => {
	if (!isNaN(rightSide.textContent + '.')) {
		appendCharToDisplay('.');
	} else if (rightSide.textContent === '') {
		appendCharToDisplay('0.');
	}
})

//keyboard support!
window.addEventListener('keydown', pressButton);
function pressButton(e) {
	if (((e.keyCode === 56 || e.keyCode === 187) && e.shiftKey) || ((e.keyCode === 189 || e.keyCode === 191) && !e.shiftKey)) { //operator
		appendOperator(e.key);
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

//called when either a number or decimal point is pressed
function appendCharToDisplay(char) {
	if (rightSide.offsetWidth >= .9 * display.offsetWidth) return; //don't allow the text to go offscreen
	//clearNext is set to true after pressing '=' and false after entering number, operator, or delete
	if (clearNext) clearAll();
	//append the character
	rightSide.textContent += char;
}

//called when operator is pressed
function appendOperator(opClicked) {
	//if there is already an operator, check if user could be trying to make a negative number
	if (operator) {
		if ((opClicked !== '-' && rightSide.textContent === '') || isNaN(rightSide.textContent)) return;
		else if (rightSide.textContent === '') { //negative number
			appendCharToDisplay('-');
			return;
		}
	}

	if (firstOperand && rightSide.textContent) { //chain of operations 
		firstOperand = round(operate(operator, firstOperand, rightSide.textContent), 13);
	} else if (rightSide.textContent === '') { //if there is no first operand, default = 0
		firstOperand = '0';
	} else { //transfer rightSide to firstOperand
		firstOperand = round(rightSide.textContent, 13);
	}
	rightSide.textContent = '';
	updateLeft(opClicked);
	clearNext = false;
}

//called when equals is pressed
function evaluate() {
	if (!firstOperand || !rightSide.textContent || isNaN(rightSide.textContent)) return; //do nothing if there aren't two operands
	rightSide.textContent = round(operate(operator, firstOperand, rightSide.textContent), 13); //round and show result in right side
	firstOperand = '';
	updateLeft('');
	clearNext = true;
}

//called when clear is pressed OR when a number/. is pressed and clearNext is true
function clearAll() {
	firstOperand = '';
	updateLeft('');
	rightSide.textContent = '';
	clearNext = false;
}

//concatenates firstOperand and operator and puts the result in  left side
function updateLeft(op) {
	operator = op;
	leftSide.textContent = firstOperand + op;
}

function round(number, places) {
	let power = +('1e' + places);
	return Math.round(number * power) / power;
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
	//validity check (assigns 0 if invalid - or already 0)
	x = +x;
	y = +y;
	if (!x) x = 0;
	if (!y) y = 0;

	switch(operator) {
		case '+': return add(x, y).toString();
		case '-': return subtract(x, y).toString();
		case '*': return multiply(x, y).toString();
		case '/': return divide(x, y).toString();
		default: return rightSide.textContent; //no operator, so no change
	}
}