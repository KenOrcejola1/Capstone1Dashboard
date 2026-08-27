import { createContext, useContext } from 'react';

export const DashboardNavContext = createContext<(view: any) => void>(() => {});

export function useDashboardNav() {
  return useContext(DashboardNavContext);
}
