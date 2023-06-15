const ZERO = "0";
const ONE = "1";
const TWO = "2";
const THREE = "3";
const FOUR = "4";
const FIVE = "5";
const SIX = "6";
const SEVEN = "7";
const EIGHT = "8";
const NINE = "9";
const PLUS = "+";
const MINUS = "-";
const STAR = "*";
const SLASH = "/";
const CARET = "^";
const MODULO = "%";
const EQUAL = "=";

const DIGITS = [ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE];

const OPERATORS = [PLUS, MINUS, STAR, SLASH, CARET, MODULO, EQUAL];

const TOKENS = [...DIGITS, ...OPERATORS];

document.addEventListener("keydown", ({ key }) => {
  if (key in TOKENS) {
    console.log(key);
  }
  if (key == "Enter") {
    console.log("Enter");
  }
  if (key == "Backspace") {
    console.log("Backspace");
  }
});

const ROWS = 6;
const CELLS = 8;

function createElement(tag: keyof HTMLElementTagNameMap, ...classes: string[]) {
  const element = document.createElement(tag);
  element.className = classes.join(" ");
  return element;
}

function createBoard() {
  const board = createElement("div", "board");
  for (let i = 0; i < ROWS; i++) {
    const row = createElement("div", "board-row");
    for (let j = 0; j < CELLS; j++) {
      const cell = createElement("div", "board-cell");
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
  return board;
}

function createKeyboard() {
  const keyboard = createElement("div", "keyboard");
  const firstRow = createElement("div", "keyboard-row");
  for (const DIGIT in DIGITS) {
    const button = createElement("button", "keyboard-button");
    button.textContent = DIGIT;
    firstRow.appendChild(button);
  }
  keyboard.appendChild(firstRow);
  const secondRow = createElement("div", "keyboard-row");
  const backspace = createElement(
    "button",
    "keyboard-button",
    "keyboard-button-double",
    "keyboard-button-center"
  );
  backspace.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="36" viewBox="0 -960 960 960" width="36"><path d="M450.667-324 560-433.334 669.333-324l47.334-47.333L606.666-480l108.667-108.667L668-636 560-526.666 450.667-636l-47.334 47.333L513.334-480 403.333-371.333 450.667-324ZM120-480l170.667-241.333q12.333-17.334 30.166-28Q338.667-760 360-760h413.334q27.5 0 47.083 19.583T840-693.334v426.668q0 27.5-19.583 47.083T773.334-200H360q-21.333 0-39.167-10.667-17.833-10.666-30.166-28L120-480Zm82.666 0 150 213.334h420.668v-426.668H352.666L202.666-480Zm570.668 0v-213.334 426.668V-480Z"/></svg>';
  secondRow.appendChild(backspace);
  for (const OPERATOR of OPERATORS) {
    const button = createElement("button", "keyboard-button");
    button.textContent = OPERATOR;
    secondRow.appendChild(button);
  }
  const enter = createElement(
    "button",
    "keyboard-button",
    "keyboard-button-double"
  );
  enter.textContent = "Enter";
  secondRow.appendChild(enter);
  keyboard.appendChild(secondRow);
  return keyboard;
}

const container = document.querySelector(".container")!;

container.appendChild(createBoard());
container.appendChild(createKeyboard());
