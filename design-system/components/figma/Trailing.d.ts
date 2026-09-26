import * as React from 'react';
export interface TrailingProps {
  className?: string;
  style?: React.CSSProperties;
  showInfo?: boolean;
  type?: "button" | "default" | "disclosure" | "picker - date" | "picker - date and time" | "picker - time" | "pop-up" | "stepper" | "toggle";
  detailText?: string;
  buttonLabel?: string;
  showDrillIn?: boolean;
  showSymbol?: boolean;
  showCheckmark?: boolean;
  /** Text content; defaults to "Pop-up". */
  text1?: string;
  /** Text content; defaults to "􀆏". */
  text2?: string;
  /** Text content; defaults to "􀆅". */
  text3?: string;
  /** Text content; defaults to "􀆊". */
  text4?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const Trailing: React.FC<TrailingProps>;
export default Trailing;
