import { createContext, useRef } from 'react';
import { StoreApi, createStore } from 'zustand';

import { StoreProviderProps } from './interface';

import { apiEndpoint } from '@/config/env';
import { mockedCompanyInfo } from '@/data/mock';
import { caseSensitiveAxiosInstance } from '@/lib/axios';

export interface CompanyState {
  id: string;
  name: string;
  email: string;
  me: () => void;
  resetAll: () => void;
}

export const StorybookCompanyStoreContext =
  createContext<StoreApi<CompanyState> | null>(null);
export const CompanyStoreContext = createContext<StoreApi<CompanyState> | null>(
  null
);

export const StorybookCompanyStoreProvider = ({
  children,
}: StoreProviderProps) => {
  const storeRef = useRef(
    createStore<CompanyState>(() => ({
      ...mockedCompanyInfo,
      me: async () => alert('Triggered me'),
      resetAll: () => alert('Triggered resetAll'),
    }))
  );

  return (
    <StorybookCompanyStoreContext.Provider value={storeRef.current}>
      {children}
    </StorybookCompanyStoreContext.Provider>
  );
};

export const CompanyStoreProvider = ({ children }: StoreProviderProps) => {
  const storeRef = useRef(
    createStore<CompanyState>()(set => ({
      id: '',
      name: '',
      email: '',
      me: async () => {
        try {
          const res = await caseSensitiveAxiosInstance.get(
            `${apiEndpoint}/companies/me`
          );
          if (res.data.status === 'success') {
            const payload = res.data.payload;
            set({
              id: payload.id,
              name: payload.name,
              email: payload.email,
            });
          } else {
            throw new Error(res.data.payload.message);
          }
        } catch (err) {
          throw new Error();
        }
      },
      resetAll: () =>
        set({
          id: '',
          name: '',
          email: '',
        }),
    }))
  );

  return (
    <CompanyStoreContext.Provider value={storeRef.current}>
      {children}
    </CompanyStoreContext.Provider>
  );
};
