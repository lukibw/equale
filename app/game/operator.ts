import { JSX } from "react";
import { Operator } from "./input";
import {
  AdditionIcon,
  DivisionIcon,
  EqualityIcon,
  ExponentationIcon,
  ModuloIcon,
  MultiplicationIcon,
  SubtractionIcon,
} from "./icon";

export enum OperatorLabel {
  Addition = "addition",
  Subtraction = "subtraction",
  Multiplication = "multiplication",
  Division = "division",
  Modulo = "modulo",
  Exponentation = "exponentation",
  Equality = "equality",
}

export interface OperatorMetadata {
  label: OperatorLabel;
  Icon: () => JSX.Element;
}

export const operatorMap: Record<Operator, OperatorMetadata> = {
  "+": { label: OperatorLabel.Addition, Icon: AdditionIcon },
  "-": { label: OperatorLabel.Subtraction, Icon: SubtractionIcon },
  "*": {
    label: OperatorLabel.Multiplication,
    Icon: MultiplicationIcon,
  },
  "/": { label: OperatorLabel.Division, Icon: DivisionIcon },
  "%": { label: OperatorLabel.Modulo, Icon: ModuloIcon },
  "^": {
    label: OperatorLabel.Exponentation,
    Icon: ExponentationIcon,
  },
  "=": { label: OperatorLabel.Equality, Icon: EqualityIcon },
};
