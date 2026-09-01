import React, { createContext, useContext, useMemo } from 'react';

import { useRegistrations } from '../hooks/useRegistrations';
import { useSettings } from '../hooks/useSettings';

type RegistrationsValue = ReturnType<typeof useRegistrations> & {
  settings: ReturnType<typeof useSettings>['settings'];
  saveSettings: ReturnType<typeof useSettings>['save'];
};

const RegistrationsContext = createContext<RegistrationsValue | null>(null);

export function RegistrationsProvider({ children }: {children: React.ReactNode;}) {
  const registrations = useRegistrations();
  const { settings, save } = useSettings();

  const value = useMemo<RegistrationsValue>(
    () => ({ ...registrations, settings, saveSettings: save }),
    [registrations, settings, save]
  );

  return (
    <RegistrationsContext.Provider value={value}>
      {children}
    </RegistrationsContext.Provider>);

}

export function useRegistrationsContext(): RegistrationsValue {
  const value = useContext(RegistrationsContext);
  if (!value) {
    throw new Error('useRegistrationsContext must be used inside RegistrationsProvider');
  }
  return value;
}