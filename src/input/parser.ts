import { Token, tokenToNumber } from "./token";
import { Expr, BinaryOperator, Formula } from "./formula";

export interface State {
  current: number;
  tokens: Token[];
}

export const newState = (tokens: Token[]): State => {
  return { current: 0, tokens };
};

export const isEnd = (s: State) => {
  return s.current === s.tokens.length;
};

export const check = (s: State, t: Token) => {
  return s.tokens[s.current] === t;
};

export const advance = (s: State) => {
  return s.tokens[s.current++];
};

export type Handler<T> = (s: State) => T | null;

export const createHandler = (
  inner: Handler<Expr>,
  operators: { [key in Token]?: BinaryOperator }
): Handler<Expr> => {
  return (s) => {
    const left = inner(s);
    if (left === null || isEnd(s)) {
      return null;
    }
    if (check(s, Token.Equal)) {
      return left;
    }
    const operator = operators[advance(s)];
    if (!operator) {
      return null;
    }
    const right = inner(s);
    if (right === null || isEnd(s)) {
      return null;
    }
    return { left, operator, right };
  };
};

export const numberHandler: Handler<number> = (s) => {
  let n = tokenToNumber(advance(s));
  if (n === null || n === 0) {
    return null;
  }
  let m = 0;
  while (true) {
    m += n;
    if (isEnd(s) || check(s, Token.Equal)) {
      break;
    }
    n = tokenToNumber(advance(s));
    if (n === null) {
      break;
    }
    m *= 10;
  }
  return m;
};

export const caretHandler = createHandler(numberHandler, {
  [Token.Caret]: BinaryOperator.Exponentation,
});

export const percentHandler = createHandler(caretHandler, {
  [Token.Percent]: BinaryOperator.Modulus,
});

export const starAndSlashHandler = createHandler(percentHandler, {
  [Token.Star]: BinaryOperator.Multiplication,
  [Token.Slash]: BinaryOperator.Division,
});

export const plusAndMinusHandler = createHandler(starAndSlashHandler, {
  [Token.Plus]: BinaryOperator.Addition,
  [Token.Minus]: BinaryOperator.Subtraction,
});

export const formulaHandler: Handler<Formula> = (s) => {
  const left = plusAndMinusHandler(s);
  if (left === null || typeof left === "number") {
    return null;
  }
  if (advance(s) !== Token.Equal) {
    return null;
  }
  const right = numberHandler(s);
  if (right === null) {
    return null;
  }
  if (!isEnd(s)) {
    return null;
  }
  return { left, right };
};

export const parseTokens = (arr: Token[]) => {
  return formulaHandler(newState(arr));
};
