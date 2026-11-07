export const CRUISE_MENU_BREAKPOINTS = {
  md: { query: "(min-width: 48rem)", hidden: "md:hidden", flex: "md:flex", mr0: "md:mr-0" },
  lg: { query: "(min-width: 64rem)", hidden: "lg:hidden", flex: "lg:flex", mr0: "lg:mr-0" },
} as const;

export type CruiseMenuBreakpoint = keyof typeof CRUISE_MENU_BREAKPOINTS;
