import * as React from 'react';
export interface WidgetItemsProps {
  className?: string;
  style?: React.CSSProperties;
  header?: string;
  property1?: "extra large" | "large";
  emoji?: string;
  /** Text content; defaults to "$". */
  text1?: string;
  /** Text content; defaults to "Credit card payment". */
  text2?: string;
  /** Status line (e.g. "Due Today", "Closes in 30mins"). */
  status?: string;
  /** "red" = attention/immediate, "open" = subtle grey. */
  statusTone?: "red" | "open";
  /** Extra-large only: icon tile background (e.g. rgb(255,229,204) for travel). */
  tileColor?: string;
}
export declare const WidgetItems: React.FC<WidgetItemsProps>;
export default WidgetItems;
