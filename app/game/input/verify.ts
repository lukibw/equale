import { Operator, Token } from "./token";

export enum IssueKind {
  LeadingZero = "number cannot start with 0",
  MissingEquality = "expected equality operator",
  MissingNumber = "expected number",
  WrongSize = "formula size must be 8",
  NotAllowed = "operation not allowed",
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

export const IssueMissingEquality = new Issue(IssueKind.MissingEquality);

export const IssueWrongSize = new Issue(IssueKind.WrongSize);

export const IssueNotBinary = new Issue(IssueKind.NotBinary);

export const IssueNotEqual = new Issue(IssueKind.NotEqual);

type Expr = BinaryExpr | number;

interface BinaryExpr {
  left: Expr;
  operator: Operator;
  index: number;
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
      const index = s.current;
      const operator = peek(s) as Operator;
      if (!operators.includes(operator)) {
        break;
      }
      advance(s);
      const right = inner(s);
      if (right instanceof Issue) {
        return right;
      }
      left = { left, operator, index, right };
    }
    return left;
  };
};

const number: Handler<number> = (s) => {
  let n = peek(s);
  if (typeof n !== "number") {
    return new Issue(IssueKind.MissingNumber, s.current);
  }
  advance(s);
  if (n === 0) {
    if (typeof peek(s) === "number") {
      return new Issue(IssueKind.LeadingZero, s.current - 1);
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
  if (left instanceof Issue) {
    return left;
  }
  if (isEnd(s)) {
    return IssueMissingEquality;
  }
  if (typeof left === "number") {
    return IssueNotBinary;
  }
  advance(s);
  const right = number(s);
  if (right instanceof Issue) {
    return right;
  }
  if (!isEnd(s)) {
    return new Issue(IssueKind.NotEnd, s.current);
  }
  return { left, right };
};

const resolveBinaryExpr = (expr: BinaryExpr): Issue | number => {
  let left: number;
  let right: number;
  if (typeof expr.left === "number") {
    left = expr.left;
  } else {
    const x = resolveBinaryExpr(expr.left);
    if (x instanceof Issue) {
      return x;
    }
    left = x;
  }
  if (typeof expr.right === "number") {
    right = expr.right;
  } else {
    const x = resolveBinaryExpr(expr.right);
    if (x instanceof Issue) {
      return x;
    }
    right = x;
  }
  if (left !== 0 && right !== 0) {
    switch (expr.operator) {
      case "+":
        return left + right;
      case "-":
        if (right > left) {
          break;
        }
        return left - right;
      default:
        if (left !== 1 && right !== 1) {
          switch (expr.operator) {
            case "*":
              return left * right;
            case "/":
              if (left % right !== 0) {
                break;
              }
              return left / right;
            case "%":
              if (left % right === 0) {
                break;
              }
              return left % right;
            case "^":
              return left ** right;
          }
        }
    }
  }
  return new Issue(IssueKind.NotAllowed, expr.index);
};

export const verify = (tokens: Token[]): Issue | null => {
  if (tokens.length !== 8) {
    return IssueWrongSize;
  }
  const formula = formulaHandler({ current: 0, tokens });
  if (formula instanceof Issue) {
    return formula;
  }
  const resolved = resolveBinaryExpr(formula.left);
  if (resolved instanceof Issue) {
    return resolved;
  }
  if (resolved !== formula.right) {
    return IssueNotEqual;
  }
  return null;
};
