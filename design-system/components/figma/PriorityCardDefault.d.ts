import * as React from 'react';
export interface PriorityCardDefaultProps {
  className?: string;
  style?: React.CSSProperties;
  header?: string;
  sender?: string;
  /** Text content; defaults to "Credit card payment". */
  text1?: string;
  /** Replaces the 64px source tile content (default: RBC bitmap). */
  tile?: React.ReactNode;
  /** Tile background. */
  tileColor?: string;
  onReviewed?: () => void;
  onOpen?: () => void;
  onMore?: () => void;
  /** Text content; defaults to "RBC Mastercard". */
  text2?: string;
  /** Text content; defaults to "Reviewed". */
  text3?: string;
  /** Text content; defaults to "Open in Gmail". */
  text4?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const PriorityCardDefault: React.FC<PriorityCardDefaultProps>;
export default PriorityCardDefault;
