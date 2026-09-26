import * as React from 'react';
export interface LoadingProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "73%". */
  text1?: string;
}
export declare const Loading: React.FC<LoadingProps>;
export default Loading;
