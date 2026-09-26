import * as React from 'react';
export interface PriceCardsProps {
  className?: string;
  style?: React.CSSProperties;
  amount?: string;
  property1?: "default" | "selected";
  type?: string;
  tag?: boolean;
  subtext?: string;
  /** Text content; defaults to "Yearly". */
  text1?: string;
  /** Text content; defaults to "$12.99". */
  text2?: string;
  /** Text content; defaults to "/year". */
  text3?: string;
  /** Text content; defaults to "That's $8.33/month". */
  text4?: string;
}
export declare const PriceCards: React.FC<PriceCardsProps>;
export default PriceCards;
