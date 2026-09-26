import * as React from 'react';
export interface IncrementProps {
  className?: string;
  style?: React.CSSProperties;
  style2?: "default" | "pressed" | "disabled";
  /** Text content; defaults to "􀅼". */
  text1?: string;
}
export declare const Increment: React.FC<IncrementProps>;
export default Increment;
