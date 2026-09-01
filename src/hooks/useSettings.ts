import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_SETTINGS,
  getSettings,
  updateSettings } from
'../services/registrationApi';
import type { EventSettings } from '../types/registration';

interface UseSettings {
  settings: EventSettings;
  isLoading: boolean;
  save: (patch: Partial<EventSettings>) => Promise<EventSettings>;
}

export function useSettings(): UseSettings {
  const [settings, setSettings] = useState<EventSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getSettings().
    then((loaded) => {
      if (active) setSettings(loaded);
    }).
    catch(() => {

      /* fall back to defaults */}).
    finally(() => {
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback(async (patch: Partial<EventSettings>) => {
    const next = await updateSettings(patch);
    setSettings(next);
    return next;
  }, []);

  return { settings, isLoading, save };
}