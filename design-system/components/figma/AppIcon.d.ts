import * as React from 'react';
export interface AppIconProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "mono" | "pridey" | "signature" | "gradient";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const AppIcon: React.FC<AppIconProps>;
export default AppIcon;
