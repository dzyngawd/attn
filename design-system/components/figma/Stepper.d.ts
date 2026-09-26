import * as React from 'react';
export interface StepperProps {
  className?: string;
  style?: React.CSSProperties;
  mode?: "light";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}
export declare const Stepper: React.FC<StepperProps>;
export default Stepper;
