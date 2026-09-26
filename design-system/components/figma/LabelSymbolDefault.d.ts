import * as React from 'react';
export interface LabelSymbolDefaultProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  mode?: "light" | "dark";
  isEnabled?: boolean;
}
export declare const LabelSymbolDefault: React.FC<LabelSymbolDefaultProps>;
export default LabelSymbolDefault;
