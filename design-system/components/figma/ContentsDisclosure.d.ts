import * as React from 'react';
export interface ContentsDisclosureProps {
  className?: string;
  style?: React.CSSProperties;
  disclosed?: boolean;
  /** Text content; defaults to "􀆊". */
  text1?: string;
}
export declare const ContentsDisclosure: React.FC<ContentsDisclosureProps>;
export default ContentsDisclosure;
