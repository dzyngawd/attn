import * as React from 'react';
export interface ButtonLiquidGlassSymbolProps {
  className?: string;
  style?: React.CSSProperties;
  style2?: "glass prominent" | "glass";
  isEnabled?: boolean;
  destructive?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}
export declare const ButtonLiquidGlassSymbol: React.FC<ButtonLiquidGlassSymbolProps>;
export default ButtonLiquidGlassSymbol;
