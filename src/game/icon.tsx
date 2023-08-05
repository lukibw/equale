import { ReactNode } from "react";
import styles from "./icon.module.css";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className={styles.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

export function AdditionIcon() {
  return (
    <Icon>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </Icon>
  );
}

export function SubtractionIcon() {
  return (
    <Icon>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </Icon>
  );
}

export function MultiplicationIcon() {
  return (
    <Icon>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </Icon>
  );
}

export function DivisionIcon() {
  return (
    <Icon>
      <circle cx="12" cy="6" r="2"></circle>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <circle cx="12" cy="18" r="2"></circle>
    </Icon>
  );
}

export function ModuloIcon() {
  return (
    <Icon>
      <line x1="19" y1="5" x2="5" y2="19"></line>
      <circle cx="6.5" cy="6.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </Icon>
  );
}

export function ExponentationIcon() {
  return (
    <Icon>
      <polyline points="18 12 12 6 6 12"></polyline>
    </Icon>
  );
}

export function EqualityIcon() {
  return (
    <Icon>
      <line x1="5" y1="9" x2="19" y2="9"></line>
      <line x1="5" y1="15" x2="19" y2="15"></line>
    </Icon>
  );
}

export function BackspaceIcon() {
  return (
    <Icon>
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
      <line x1="18" y1="9" x2="12" y2="15"></line>
      <line x1="12" y1="9" x2="18" y2="15"></line>
    </Icon>
  );
}
