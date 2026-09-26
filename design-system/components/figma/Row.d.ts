import * as React from 'react';
export interface RowProps {
  className?: string;
  style?: React.CSSProperties;
  showEditButton?: boolean;
  showImage?: boolean;
  height?: "regular" | "tall";
  showSubtitle?: boolean;
  showTrailing?: boolean;
  showGrabber?: boolean;
  title?: string;
  subtitle?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon3?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon4?: React.ReactNode;
}
export declare const Row: React.FC<RowProps>;
export default Row;
