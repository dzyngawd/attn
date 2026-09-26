import * as React from 'react';
export interface HeaderProps {
  className?: string;
  style?: React.CSSProperties;
  headerText?: string;
  level?: "l1" | "l2" | "l3";
  state?: "default" | "on-scroll";
  /** Text content; defaults to "Needs attn.". */
  text1?: string;
  /** Text content; defaults to "Monday, July 20". */
  text2?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}
export declare const Header: React.FC<HeaderProps>;
export default Header;
