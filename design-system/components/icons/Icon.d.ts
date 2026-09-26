import * as React from 'react';
export type IconName =
  | "AdjustmentsVertical"
  | "AngleDown"
  | "AngleLeft"
  | "AngleUp"
  | "Annotation"
  | "Bell"
  | "Book"
  | "BookOpen"
  | "BookOpenReader"
  | "Check"
  | "ChevronRight"
  | "Close"
  | "Dna"
  | "FileLines"
  | "Fire"
  | "Grid"
  | "InfoCircle"
  | "QuestionCircle"
  | "Refresh"
  | "ShareNodes"
  | "UsersGroup";
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}
export declare const Icon: React.FC<IconProps>;
export default Icon;
