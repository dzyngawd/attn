import * as React from 'react';
export interface AppIconDefaultProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "attn". */
  text1?: string;
  /** Text content; defaults to "Normal attn icon". */
  text2?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}
export declare const AppIconDefault: React.FC<AppIconDefaultProps>;
export default AppIconDefault;
