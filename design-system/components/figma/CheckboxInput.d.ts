import * as React from 'react';
export interface CheckboxInputProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "checkbox input" | "radio input";
  size?: "base" | "default";
  status?: "initial" | "focus" | "disabled";
  checked?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const CheckboxInput: React.FC<CheckboxInputProps>;
export default CheckboxInput;
