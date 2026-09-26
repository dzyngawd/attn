import * as React from 'react';
export interface GrabberProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "􀌇". */
  text1?: string;
}
export declare const Grabber: React.FC<GrabberProps>;
export default Grabber;
