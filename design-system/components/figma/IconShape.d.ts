import * as React from 'react';
export interface IconShapeProps {
  className?: string;
  style?: React.CSSProperties;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  color?: "white" | "dark" | "brand" | "red" | "gray" | "green" | "yellow";
  type?: "circle" | "square";
  iconStyle?: React.ReactNode;
}
export declare const IconShape: React.FC<IconShapeProps>;
export default IconShape;
