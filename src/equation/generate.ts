import { Token, Operator, Digit } from "./types";

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

export type Random = (min: number, max: number) => number;

export const generate = (random: Random) => {
  const array = <T>(items: T[]) => {
    return items[random(0, items.length - 1)];
  };

  const shift = (
    left: Expr | number,
    operator: Operator,
    right: Expr | number
  ) => {
    if (typeof left === "number") {
      left = [left];
    }
    if (typeof right === "number") {
      right = [right];
    }
    if (random(1, 3) === 1) {
      return [...right, operator, ...left];
    }
    return [...left, operator, ...right];
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
    return [x, array(moduloOptions[x])];
  };

  const variants: (() => Expr)[] = [
    () => {
      const x = random(10, 89);
      const y = random(10, 99 - x);
      return shift(shift(x, "+", y), "=", x + y);
    },
    () => {
      let x = random(100, 999);
      if (x % 10 === 0) {
        x += random(1, 9);
      }
      const y = random(10 - (x % 10), 9);
      return shift(shift(x, "+", y), "=", x + y);
    },
    () => {
      const x = random(20, 99);
      const y = random(10, x - 10);
      return shift([x, "-", y], "=", x - y);
    },
    () => {
      let x = random(100, 999);
      if (x % 10 === 9) {
        x -= random(1, 9);
      }
      const y = random(x % 10, 9);
      return shift([x, "-", y], "=", x - y);
    },
    () => {
      const x1 = random(2, 9);
      const x2 = random(2, 9);
      const y = random(10, 99 - x1 * x2);
      return shift(shift([x1, "*", x2], "+", y), "=", x1 * x2 + y);
    },
    () => {
      const x1 = random(2, 9);
      const x2 = random(2, 9);
      const y = random(1, Math.min(x1 * x2 - 10, 9));
      return shift([x1, "*", x2, "-", y], "=", x1 * x2 - y);
    },
    () => {
      const x = random(12, 99);
      const y = random(Math.ceil(100 / x), 9);
      return shift(shift(x, "*", y), "=", x * y);
    },
    () => {
      const [x1, x2] = array<[number, number]>([
        [9, 3],
        [8, 4],
        [8, 2],
        [6, 3],
        [6, 2],
        [4, 2],
      ]);
      const y = random(10 - x1 / x2, 9);
      return shift(shift([x1, "/", x2], "+", y), "=", x1 / x2 + y);
    },
    () => {
      const x1 = random(2, 9);
      const x2 = random(2, 9);
      const y = random(1, x1 - 1);
      return shift([x1 * x2, "/", x2, "-", y], "=", x1 - y);
    },
    () => {
      const x = random(12, 99);
      const y = random(Math.ceil(100 / x), 9);
      return shift([x * y, "/", x], "=", y);
    },
    () => {
      const [x1, x2] = modulo(random);
      const y = random(10 - (x1 % x2), 9);
      return shift(shift([x1, "%", x2], "+", y), "=", (x1 % x2) + y);
    },
    () => {
      const [x1, x2] = modulo(random);
      const y = random(Math.ceil(10 / (x1 % x2)), 9);
      return shift(shift([x1, "%", x2], "*", y), "=", (x1 % x2) * y);
    },
    () => {
      const bounds: Record<number, number> = {
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
      const y = random(10 - Math.min(x1 ** x2, 8), 9);
      return shift(shift([x1, "^", x2], "+", y), "=", x1 ** x2 + y);
    },
    () => {
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
      const y = random(2, x1 ** x2 - 10);
      return shift([x1, "^", x2, "-", y], "=", x1 ** x2 - y);
    },
  ];

  return tokenize(array(variants)());
};
