import { Token, Digit, Operator } from "./token";

const between = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const array = <T>(items: T[]) => {
  return items[Math.floor(Math.random() * items.length)];
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

const modulo = () => {
  const x = between(3, 9);
  return [x, array(moduloOptions[x])];
};

type Formula = (Operator | number | Formula)[];

const tokenize = (formula: Formula) => {
  const tokens: Token[] = [];
  for (const item of formula) {
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
  left: Formula | number,
  operator: Operator,
  right: Formula | number
): Formula => {
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

type Variant = () => Formula;

const variants: Variant[] = [
  () => {
    const x = between(10, 89);
    const y = between(10, 99 - x);
    return [shift(x, "+", y), "=", x + y];
  },
  () => {
    let x = between(100, 999);
    if (x % 10 === 0) {
      x += between(1, 9);
    }
    const y = between(10 - (x % 10), 9);
    return [shift(x, "+", y), "=", x + y];
  },
  () => {
    const x = between(20, 99);
    const y = between(10, x - 10);
    return [x, "-", y, "=", x - y];
  },
  () => {
    let x = between(100, 999);
    if (x % 10 === 9) {
      x -= between(1, 9);
    }
    const y = between(x % 10, 9);
    return [x, "-", y, "=", x - y];
  },
  () => {
    const x1 = between(2, 9);
    const x2 = between(2, 9);
    const y = between(10, 99 - x1 * x2);
    return [shift([x1, "*", x2], "+", y), "=", x1 * x2 + y];
  },
  () => {
    const x1 = between(2, 9);
    const x2 = between(2, 9);
    const y = between(1, Math.min(x1 * x2 - 10, 9));
    return [x1, "*", x2, "-", y, "=", x1 * x2 - y];
  },
  () => {
    const x = between(12, 99);
    const y = between(Math.ceil(100 / x), 9);
    return [shift(x, "*", y), "=", x * y];
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
    const y = between(10 - x1 / x2, 9);
    return [shift([x1, "/", x2], "+", y), "=", x1 / x2 + y];
  },
  () => {
    const x1 = between(2, 9);
    const x2 = between(2, 9);
    const y = between(1, x1 - 1);
    return [x1 * x2, "/", x2, "-", y, "=", x1 - y];
  },
  () => {
    const x = between(12, 99);
    const y = between(Math.ceil(100 / x), 9);
    return [x * y, "/", shift(x, "=", y)];
  },
  () => {
    const [x1, x2] = modulo();
    const y = between(10 - (x1 % x2), 9);
    return [shift([x1, "%", x2], "+", y), "=", (x1 % x2) + y];
  },
  () => {
    const [x1, x2] = modulo();
    const y = between(Math.ceil(10 / (x1 % x2)), 9);
    return [shift([x1, "%", x2], "*", y), "=", (x1 % x2) * y];
  },
  () => {
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
    const x1 = between(2, 9);
    const x2 = between(2, bounds[x1]);
    const y = between(10 - Math.min(Math.pow(x1, x2), 8), 9);
    return [shift([x1, "^", x2], "+", y), "=", Math.pow(x1, x2) + y];
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
    const x1 = between(2, 9);
    const x2 = between(bounds[x1][0], bounds[x1][1]);
    const y = between(2, Math.pow(x1, x2) - 10);
    return [x1, "^", x2, "-", y, "=", Math.pow(x1, x2) - y];
  },
];

export const random = () => {
  return tokenize(array(variants)());
};
