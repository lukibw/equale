import { Operator, Token } from "./types";

type Expr = BinaryExpr | number;

interface BinaryExpr {
  left: Expr;
  operator: Operator;
  right: Expr;
}

interface Equation {
  left: Expr;
  right: Expr;
}

interface State {
  current: number;
  tokens: Token[];
}

const isEnd = (s: State) => {
  return s.current === s.tokens.length;
};

const peek = (s: State) => {
  return s.tokens[s.current];
};

const advance = (s: State) => {
  s.current++;
};

type Handler<T> = (s: State) => T | null;

const newHandler = (
  inner: Handler<Expr>,
  operators: Operator[]
): Handler<Expr> => {
  return (s) => {
    let left = inner(s);
    if (left === null) {
      return null;
    }
    while (true) {
      const operator = peek(s) as Operator;
      if (!operators.includes(operator)) {
        break;
      }
      advance(s);
      const right = inner(s);
      if (right === null) {
        return null;
      }
      left = { left, operator, right };
    }
    return left;
  };
};

const number: Handler<number> = (s) => {
  let n = peek(s);
  if (typeof n !== "number") {
    return null;
  }
  advance(s);
  if (n === 0) {
    if (typeof peek(s) === "number") {
      return null;
    } else {
      return 0;
    }
  }
  let m = 0;
  while (true) {
    m += n;
    if (isEnd(s)) {
      break;
    }
    n = peek(s);
    if (typeof n !== "number") {
      break;
    }
    advance(s);
    m *= 10;
  }
  return m;
};

const unaryHandler: Handler<Expr> = (s) => {
  if (peek(s) !== "-") {
    return number(s);
  }
  advance(s);
  const n = number(s);
  if (n === null) {
    return null;
  }
  return -n;
};

const caretHandler = newHandler(unaryHandler, ["^"]);

const moduloHandler = newHandler(caretHandler, ["%"]);

const starAndSlashHandler = newHandler(moduloHandler, ["*", "/"]);

const plusAndMinusHandler = newHandler(starAndSlashHandler, ["+", "-"]);

const equationHandler: Handler<Equation> = (s) => {
  const left = plusAndMinusHandler(s);
  if (left === null) {
    return null;
  }
  if (isEnd(s)) {
    return null;
  }
  advance(s);
  const right = plusAndMinusHandler(s);
  if (right === null) {
    return null;
  }
  return { left, right };
};

const resolveExpr = (expr: Expr): number | null => {
  if (typeof expr === "number") {
    return expr;
  }
  const left = resolveExpr(expr.left);
  const right = resolveExpr(expr.right);
  if (left === null || right === null) {
    return null;
  }
  switch (expr.operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      if (right === 0) {
        return null;
      }
      return left / right;
    case "%":
      if (right === 0) {
        return null;
      }
      return left % right;
    case "^":
      return left ** right;
    default:
      throw new Error("cannot resolve binary expression");
  }
};

export const verify = (tokens: Token[]) => {
  const equation = equationHandler({ current: 0, tokens });
  if (equation === null) {
    return false;
  }
  const left = resolveExpr(equation.left);
  if (left === null) {
    return false;
  }
  const right = resolveExpr(equation.right);
  if (right === null) {
    return false;
  }
  return left === right;
};
