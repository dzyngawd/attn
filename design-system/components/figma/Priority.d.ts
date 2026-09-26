import * as React from 'react';
export interface PriorityProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "open" | "red";
  size?: "sm" | "lg";
  /** Text content; defaults to "Closes in 5 hours". */
  text1?: string;
}
export declare const Priority: React.FC<PriorityProps>;
export default Priority;
