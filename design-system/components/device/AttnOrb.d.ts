import * as React from 'react';
export type AttnVoiceState = "idle" | "listening" | "thinking" | "speaking";
/** attn assistant orb (sky + sun blobs), animated per voice state. */
export interface AttnOrbProps {
  state?: AttnVoiceState;
  /** Diameter in px. Default 203 (Figma "Loading"); device uses 295. */
  size?: number;
  /** Centered label, e.g. "73%" for analysis progress. */
  label?: string;
  animate?: boolean;
  style?: React.CSSProperties;
}
export declare const AttnOrb: React.FC<AttnOrbProps>;
export default AttnOrb;
