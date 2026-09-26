import * as React from 'react';
export interface WidgetsProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "iPad" | "iPhone";
  /** Text content; defaults to "attn". */
  text1?: string;
}
export declare const Widgets: React.FC<WidgetsProps>;
export default Widgets;
