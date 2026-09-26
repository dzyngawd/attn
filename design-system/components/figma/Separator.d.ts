import * as React from 'react';
export interface SeparatorProps {
  className?: string;
  style?: React.CSSProperties;
  mode?: "light" | "dark";
}
export declare const Separator: React.FC<SeparatorProps>;
export default Separator;
