import * as React from 'react';
export interface LabelSymbolPreferredProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  mode?: "light" | "dark";
  isEnabled?: boolean;
}
export declare const LabelSymbolPreferred: React.FC<LabelSymbolPreferredProps>;
export default LabelSymbolPreferred;
