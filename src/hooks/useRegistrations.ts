import { useCallback, useEffect, useState } from 'react';

import {
  createRegistration,
  deleteRegistration,
  listRegistrations,
  listTakenDomains,
  updatePaymentStatus } from
'../services/registrationApi';
import type {
  PaymentStatus,
  Registration,
  RegistrationInput,
  TakenDomains } from
'../types/registration';

interface UseRegistrations {
  registrations: Registration[];
  /** Domains already claimed, keyed by event id — one team per domain. */
  takenDomains: TakenDomains;
  isLoading: boolean;
  loadError: string | null;
  reload: () => Promise<void>;
  submit: (input: RegistrationInput) => Promise<Registration>;
  setPaymentStatus: (id: string, status: PaymentStatus) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useRegistrations(): UseRegistrations {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [takenDomains, setTakenDomains] = useState<TakenDomains>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [records, taken] = await Promise.all([
      listRegistrations(),
      listTakenDomains()]
      );
      setRegistrations(records);
      setTakenDomains(taken);
    } catch (error) {
      setLoadError(
        error instanceof Error ?
        error.message :
        'Could not reach the registration service.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const submit = useCallback(async (input: RegistrationInput) => {
    const record = await createRegistration(input);
    setRegistrations((current) => [...current, record]);
    if (record.domain) {
      setTakenDomains((current) => ({
        ...current,
        [record.eventId]: [...(current[record.eventId] ?? []), record.domain]
      }));
    }
    return record;
  }, []);

  const setPaymentStatus = useCallback(async (id: string, status: PaymentStatus) => {
    const updated = await updatePaymentStatus(id, status);
    setRegistrations((current) =>
    current.map((record) => record.id === id ? updated : record)
    );
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteRegistration(id);
    setRegistrations((current) => current.filter((record) => record.id !== id));
    setTakenDomains(await listTakenDomains());
  }, []);

  return {
    registrations,
    takenDomains,
    isLoading,
    loadError,
    reload,
    submit,
    setPaymentStatus,
    remove
  };
}