import { Operator, Token } from "./token";

export enum IssueKind {
  LeadingZero = "number cannot start with 0",
  DivideByZero = "cannot divide by 0",
  MissingEquality = "expected equality operator",
  MissingNumber = "expected number",
  WrongSize = "formula size must be 8",
  NotBinary = "the left side of the formula must be a binary operation",
  NotEqual = "the left side of the formula must be equal to the right side",
  NotEnd = "expected end of the formula",
}

export class Issue {
  readonly kind: IssueKind;
  readonly index?: number;

  constructor(kind: IssueKind, index?: number) {
    this.kind = kind;
    this.index = index;
  }
}

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

const previous = (s: State) => {
  if (s.current === 0) {
    return null;
  }
  return s.tokens[s.current - 1];
};

const advance = (s: State) => {
  s.current++;
};

const issue = (s: State, kind: IssueKind) => {
  return new Issue(kind, s.current);
};

type Handler<T> = (s: State) => T | Issue;

const newHandler = (
  inner: Handler<Expr>,
  operators: Operator[]
): Handler<Expr> => {
  return (s) => {
    let left = inner(s);
    if (left instanceof Issue) {
      return left;
    }
    while (true) {
      const operator = peek(s) as Operator;
      if (!operators.includes(operator)) {
        break;
      }
      advance(s);
      const right = inner(s);
      if (right instanceof Issue) {
        return right;
      }
      left = { left, operator, right };
    }
    return left;
  };
};

const number: Handler<number> = (s) => {
  let n = peek(s);
  if (typeof n !== "number") {
    return issue(s, IssueKind.MissingNumber);
  }
  advance(s);
  if (n === 0) {
    if (typeof peek(s) === "number") {
      return issue(s, IssueKind.LeadingZero);
    }
    const prev = previous(s);
    if (prev === "/" || prev === "%") {
      return issue(s, IssueKind.DivideByZero);
    }
    return 0;
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
  if (left instanceof Issue) {
    return left;
  }
  if (typeof left === "number") {
    return new Issue(IssueKind.NotBinary);
  }
  if (peek(s) !== "=") {
    return issue(s, IssueKind.MissingEquality);
  }
  advance(s);
  const right = number(s);
  if (right instanceof Issue) {
    return right;
  }
  if (!isEnd(s)) {
    return issue(s, IssueKind.NotEnd);
  }
  return { left, right };
};

const resolveBinaryExpr = (expr: BinaryExpr) => {
  let left: number;
  let right: number;
  if (typeof expr.left === "number") {
    left = expr.left;
  } else {
    left = resolveBinaryExpr(expr.left);
  }
  if (typeof expr.right === "number") {
    right = expr.right;
  } else {
    right = resolveBinaryExpr(expr.right);
  }
  switch (expr.operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "%":
      return left % right;
    case "^":
      return left ** right;
    default:
      throw new Error("cannot resolve binary expression");
  }
};

export const verify = (tokens: Token[]): Issue | null => {
  if (tokens.length !== 8) {
    return new Issue(IssueKind.WrongSize);
  }
  const formula = formulaHandler({ current: 0, tokens });
  if (formula instanceof Issue) {
    return formula;
  }
  if (resolveBinaryExpr(formula.left) !== formula.right) {
    return new Issue(IssueKind.NotEqual);
  }
  return null;
};
