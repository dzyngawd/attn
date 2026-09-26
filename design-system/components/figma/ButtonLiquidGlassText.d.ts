import * as React from 'react';
export interface ButtonLiquidGlassTextProps {
  className?: string;
  style?: React.CSSProperties;
  size?: "sm" | "md" | "lg";
  style2?: "glass prominent" | "glass";
  destructive?: boolean;
  isEnabled?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}
export declare const ButtonLiquidGlassText: React.FC<ButtonLiquidGlassTextProps>;
export default ButtonLiquidGlassText;
