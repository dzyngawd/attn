import * as React from 'react';
export interface AccordionProps {
  className?: string;
  style?: React.CSSProperties;
  leftIcon?: React.ReactNode;
  showLeftIcon?: boolean;
  style2?: "default" | "flush" | "separate cards" | "multi-level" | "with sub-header";
  darkVersion?: "false";
  icon?: "true";
  breakpoint?: "desktop" | "mobile";
  showRightIcon?: boolean;
  /** Text content; defaults to "Can I use Flowbite in open-source projects?". */
  text1?: string;
  /** Text content; defaults to "With that being said, feel free to use this design kit for your open-source projects.". */
  text2?: string;
  /** Text content; defaults to "Can I contribute to the Flowbite project?". */
  text3?: string;
  /** Text content; defaults to "What are the main features of Flowbite?". */
  text4?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon3?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon4?: React.ReactNode;
}
export declare const Accordion: React.FC<AccordionProps>;
export default Accordion;
