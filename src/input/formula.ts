export interface Formula {
  left: BinaryExpr;
  right: number;
}

export type Expr = BinaryExpr | number;

export enum BinaryOperator {
  Addition,
  Subtraction,
  Multiplication,
  Division,
  Modulus,
  Exponentation,
}

export interface BinaryExpr {
  left: Expr;
  operator: BinaryOperator;
  right: Expr;
}

export const resolveBinaryExpr = (expr: BinaryExpr) => {
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
    case BinaryOperator.Addition:
      return left + right;
    case BinaryOperator.Multiplication:
      return left - right;
    case BinaryOperator.Multiplication:
      return left * right;
    case BinaryOperator.Division:
      return left / right;
    case BinaryOperator.Modulus:
      return left % right;
    case BinaryOperator.Exponentation:
      return left ** right;
    default:
      throw new Error("cannot resolve binary expression");
  }
};

export const isFormulaValid = (f: Formula) => {
  return resolveBinaryExpr(f.left) === f.right;
};
