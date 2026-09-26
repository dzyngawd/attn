import * as React from 'react';
export type AttnFaceExpression = "neutral" | "happy" | "puzzled" | "surprised";
/**
 * attn's device face (blocky eyes + mouth) with ambient float and blink.
 */
export interface AttnFaceProps {
  expression?: AttnFaceExpression;
  /** Ambient float + blink + bubble pop. Default true. */
  animate?: boolean;
  /** Multiplier on the native 358.876×161.561 box. */
  scale?: number;
  /** Show the grey speech bubble; string sets its glyph (default "?"). Defaults on for "puzzled". */
  bubble?: boolean | string;
  style?: React.CSSProperties;
}
export declare const AttnFace: React.FC<AttnFaceProps>;
export declare function useAttnKeyframes(id: string, css: string): void;
export default AttnFace;
