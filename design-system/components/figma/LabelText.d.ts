import * as React from 'react';
export interface LabelTextProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  mode?: "dark" | "light";
  size?: "lg" | "sm";
  isEnabled?: boolean;
  type?: "destructive" | "default" | "preferred";
}
export declare const LabelText: React.FC<LabelTextProps>;
export default LabelText;
