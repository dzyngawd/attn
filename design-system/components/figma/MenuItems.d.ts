import * as React from 'react';
export interface MenuItemsProps {
  className?: string;
  style?: React.CSSProperties;
  showSymbol?: boolean;
  showCheckmark?: boolean;
  showSubtitle?: boolean;
  symbol?: string;
  label?: string;
  subtitle?: string;
  showShortcut?: boolean;
  showControl?: boolean;
  showOption?: boolean;
  showShift?: boolean;
  showCommand?: boolean;
  letter?: string;
  mode?: "light" | "dark";
  state?: "default" | "destructive" | "disabled";
  menuHasSelection?: boolean;
  /** Text content; defaults to "􀆅". */
  text1?: string;
  /** Text content; defaults to "􀆍". */
  text2?: string;
  /** Text content; defaults to "􀆕". */
  text3?: string;
  /** Text content; defaults to "􀆝". */
  text4?: string;
}
export declare const MenuItems: React.FC<MenuItemsProps>;
export default MenuItems;
