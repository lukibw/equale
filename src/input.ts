export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Operator = "+" | "-" | "*" | "/" | "%" | "^" | "=";

export type Token = Digit | Operator;

type Expr = BinaryExpr | number;

interface BinaryExpr {
  left: Expr;
  operator: Operator;
  right: Expr;
}

interface Formula {
  left: BinaryExpr;
  right: number;
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
    if (!left) {
      return null;
    }
    while (true) {
      const operator = peek(s) as Operator;
      if (!operators.includes(operator)) {
        break;
      }
      advance(s);
      const right = inner(s);
      if (!right) {
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

const caretHandler = newHandler(number, ["^"]);

const moduloHandler = newHandler(caretHandler, ["%"]);

const starAndSlashHandler = newHandler(moduloHandler, ["*", "/"]);

const plusAndMinusHandler = newHandler(starAndSlashHandler, ["+", "-"]);

const formulaHandler: Handler<Formula> = (s) => {
  const left = plusAndMinusHandler(s);
  if (!left || typeof left === "number") {
    return null;
  }
  if (peek(s) !== "=") {
    return null;
  }
  advance(s);
  const right = number(s);
  if (!right || !isEnd(s)) {
    return null;
  }
  return { left, right };
};

const resolveBinaryExpr = (expr: BinaryExpr) => {
  let left: number;
  let right: number;
  if (typeof expr.left === "number") {
    left = expr.left;
  } else {
    const x = resolveBinaryExpr(expr.left);
    if (x === null) {
      return null;
    }
    left = x;
  }
  if (typeof expr.right === "number") {
    right = expr.right;
  } else {
    const x = resolveBinaryExpr(expr.right);
    if (x === null) {
      return null;
    }
    right = x;
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
  const formula = formulaHandler({ current: 0, tokens });
  return !!formula && resolveBinaryExpr(formula.left) === formula.right;
};
