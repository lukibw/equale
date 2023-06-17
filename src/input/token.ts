export enum Token {
  Zero,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Plus,
  Minus,
  Star,
  Slash,
  Percent,
  Caret,
  Equal,
}

const numberMap = {
  [Token.Zero]: 0,
  [Token.One]: 1,
  [Token.Two]: 2,
  [Token.Three]: 3,
  [Token.Four]: 4,
  [Token.Five]: 5,
  [Token.Six]: 6,
  [Token.Seven]: 7,
  [Token.Eight]: 8,
  [Token.Nine]: 9,
};

export const tokenToNumber = (token: Token): number | null => {
  return numberMap[token] ?? null;
};

const stringMap = {
  "0": Token.Zero,
  "1": Token.One,
  "2": Token.Two,
  "3": Token.Three,
  "4": Token.Four,
  "5": Token.Five,
  "6": Token.Six,
  "7": Token.Seven,
  "8": Token.Eight,
  "9": Token.Nine,
  "+": Token.Plus,
  "-": Token.Minus,
  "*": Token.Star,
  "/": Token.Slash,
  "%": Token.Percent,
  "^": Token.Caret,
  "=": Token.Equal,
};

export const tokenFromString = (s: string): Token | null => {
  return stringMap[s] ?? null;
};
