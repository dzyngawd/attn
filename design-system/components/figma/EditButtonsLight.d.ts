import * as React from 'react';
export interface EditButtonsLightProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "selected" | "unselected" | "add" | "remove";
  /** Text content; defaults to "􀅽". */
  text1?: string;
}
export declare const EditButtonsLight: React.FC<EditButtonsLightProps>;
export default EditButtonsLight;
