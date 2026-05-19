export type TourRole = "doctor" | "admin" | "all";

export type TourPlacement =
  | "top"
  | "top-start"
  | "bottom"
  | "bottom-start"
  | "left"
  | "right";

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
  placement: TourPlacement;
  roles: TourRole[];
  isModal?: boolean;
  mountDelay?: number;
}

export interface TourRoute {
  pathname: string;
  matchMode: "exact" | "startsWith";
  steps: TourStep[];
}
