import * as React from 'react';
export interface ImagesRegularProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "fill" | "circular" | "rounded" | "symbol";
  /** Text content; defaults to "􀋂". */
  text1?: string;
}
export declare const ImagesRegular: React.FC<ImagesRegularProps>;
export default ImagesRegular;
