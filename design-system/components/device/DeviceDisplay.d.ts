import * as React from 'react';
export type DeviceState = "idle" | "listening" | "thinking" | "speaking" | "display" | "happy" | "puzzled" | "alert";
export interface DeviceItem { symbol: string; title: string; status: string; tile?: string; tone?: "red" | "open"; }
/**
 * Landscape attn device screen (1328×616 native): sky gradient, Agbalumo clock, face, 3 widget items, voice overlay.
 */
export interface DeviceDisplayProps {
  state?: DeviceState;
  time?: string;
  date?: string;
  /** Up to 3 shown. */
  items?: DeviceItem[];
  /** Render scale. Default 0.5 (664×308). */
  scale?: number;
  animate?: boolean;
  style?: React.CSSProperties;
}
export declare const DeviceDisplay: React.FC<DeviceDisplayProps>;
export default DeviceDisplay;
