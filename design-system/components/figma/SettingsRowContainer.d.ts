import * as React from 'react';
export interface SettingsRowContainerProps {
  className?: string;
  style?: React.CSSProperties;
  showIcon?: boolean;
  /** Text content; defaults to "Notifications". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}
export declare const SettingsRowContainer: React.FC<SettingsRowContainerProps>;
export default SettingsRowContainer;
