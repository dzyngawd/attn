import * as React from 'react';
export interface StatusBarIPhoneProps {
  className?: string;
  style?: React.CSSProperties;
  background?: boolean;
  /** Text content; defaults to "9:41". */
  text1?: string;
}
export declare const StatusBarIPhone: React.FC<StatusBarIPhoneProps>;
export default StatusBarIPhone;
