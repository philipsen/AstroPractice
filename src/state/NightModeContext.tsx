import { createContext, useContext } from 'react';

export type NightModeContextType = {
  nightMode: boolean;
  setNightMode: (v: boolean) => void;
};

export const NightModeContext = createContext<NightModeContextType | undefined>(undefined);

export function useNightMode() {
  const ctx = useContext(NightModeContext);
  if (!ctx) throw new Error('useNightMode must be used within NightModeContext.Provider');
  return ctx;
}
