import * as React from 'react';
export interface ImagesTallProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "fill" | "circular" | "rounded" | "symbol";
  /** Text content; defaults to "􀋂". */
  text1?: string;
}
export declare const ImagesTall: React.FC<ImagesTallProps>;
export default ImagesTall;
