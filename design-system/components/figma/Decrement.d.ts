import * as React from 'react';
export interface DecrementProps {
  className?: string;
  style?: React.CSSProperties;
  style2?: "default" | "pressed" | "disabled";
  /** Text content; defaults to "􀅽". */
  text1?: string;
}
export declare const Decrement: React.FC<DecrementProps>;
export default Decrement;
