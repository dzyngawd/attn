import * as React from 'react';
export interface ToggleSwitchProps {
  className?: string;
  style?: React.CSSProperties;
  showAXLabel?: boolean;
  state?: "idle" | "pressed";
  isOn?: boolean;
  isEnabled?: boolean;
}
export declare const ToggleSwitch: React.FC<ToggleSwitchProps>;
export default ToggleSwitch;
