import { Token, Operator, Digit } from "./token";

export type Random = (min: number, max: number) => number;

const array = <T>(random: Random, items: T[]): T => {
  return items[random(0, items.length - 1)];
};

const moduloOptions: Record<number, number[]> = {
  3: [2],
  4: [3],
  5: [2, 3, 4],
  6: [4, 5],
  7: [2, 3, 4, 5, 6],
  8: [3, 5, 6, 7],
  9: [2, 4, 5, 6, 7, 8],
};

const modulo = (random: Random) => {
  const x = random(3, 9);
  return [x, array(random, moduloOptions[x])];
};

type Expr = (Operator | number | Expr)[];

const tokenize = (expr: Expr) => {
  const tokens: Token[] = [];
  for (const item of expr) {
    if (typeof item === "number") {
      let x = item;
      while (x > 0) {
        tokens.push((x % 10) as Digit);
        x /= 10;
      }
    } else if (Array.isArray(item)) {
      tokens.push(...tokenize(item));
    } else {
      tokens.push(item);
    }
  }
  return tokens;
};

const shift = (
  left: Expr | number,
  operator: Operator,
  right: Expr | number
): Expr => {
  if (typeof left === "number") {
    left = [left];
  }
  if (typeof right === "number") {
    right = [right];
  }
  if (Math.random() < 0.5) {
    return [...right, operator, ...left];
  }
  return [...left, operator, ...right];
};

type Variant = (random: Random) => Expr;

const variants: Variant[] = [
  (random) => {
    const x = random(10, 89);
    const y = random(10, 99 - x);
    return [shift(x, "+", y), "=", x + y];
  },
  (random) => {
    let x = random(100, 999);
    if (x % 10 === 0) {
      x += random(1, 9);
    }
    const y = random(10 - (x % 10), 9);
    return [shift(x, "+", y), "=", x + y];
  },
  (random) => {
    const x = random(20, 99);
    const y = random(10, x - 10);
    return [x, "-", y, "=", x - y];
  },
  (random) => {
    let x = random(100, 999);
    if (x % 10 === 9) {
      x -= random(1, 9);
    }
    const y = random(x % 10, 9);
    return [x, "-", y, "=", x - y];
  },
  (random) => {
    const x1 = random(2, 9);
    const x2 = random(2, 9);
    const y = random(10, 99 - x1 * x2);
    return [shift([x1, "*", x2], "+", y), "=", x1 * x2 + y];
  },
  (random) => {
    const x1 = random(2, 9);
    const x2 = random(2, 9);
    const y = random(1, Math.min(x1 * x2 - 10, 9));
    return [x1, "*", x2, "-", y, "=", x1 * x2 - y];
  },
  (random) => {
    const x = random(12, 99);
    const y = random(Math.ceil(100 / x), 9);
    return [shift(x, "*", y), "=", x * y];
  },
  (random) => {
    const [x1, x2] = array<[number, number]>(random, [
      [9, 3],
      [8, 4],
      [8, 2],
      [6, 3],
      [6, 2],
      [4, 2],
    ]);
    const y = random(10 - x1 / x2, 9);
    return [shift([x1, "/", x2], "+", y), "=", x1 / x2 + y];
  },
  (random) => {
    const x1 = random(2, 9);
    const x2 = random(2, 9);
    const y = random(1, x1 - 1);
    return [x1 * x2, "/", x2, "-", y, "=", x1 - y];
  },
  (random) => {
    const x = random(12, 99);
    const y = random(Math.ceil(100 / x), 9);
    return [x * y, "/", shift(x, "=", y)];
  },
  (random) => {
    const [x1, x2] = modulo(random);
    const y = random(10 - (x1 % x2), 9);
    return [shift([x1, "%", x2], "+", y), "=", (x1 % x2) + y];
  },
  (random) => {
    const [x1, x2] = modulo(random);
    const y = random(Math.ceil(10 / (x1 % x2)), 9);
    return [shift([x1, "%", x2], "*", y), "=", (x1 % x2) * y];
  },
  (random) => {
    const bounds = {
      2: 6,
      3: 4,
      4: 3,
      5: 2,
      6: 2,
      7: 2,
      8: 2,
      9: 2,
    };
    const x1 = random(2, 9);
    const x2 = random(2, bounds[x1]);
    const y = random(10 - Math.min(Math.pow(x1, x2), 8), 9);
    return [shift([x1, "^", x2], "+", y), "=", Math.pow(x1, x2) + y];
  },
  (random) => {
    const bounds: Record<number, [number, number]> = {
      2: [4, 6],
      3: [3, 4],
      4: [2, 3],
      5: [2, 2],
      6: [2, 2],
      7: [2, 2],
      8: [2, 2],
      9: [2, 2],
    };
    const x1 = random(2, 9);
    const x2 = random(bounds[x1][0], bounds[x1][1]);
    const y = random(2, Math.pow(x1, x2) - 10);
    return [x1, "^", x2, "-", y, "=", Math.pow(x1, x2) - y];
  },
];

export const generate = (random: Random) => {
  return tokenize(array(random, variants)(random));
};
