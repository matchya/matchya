import { createContext, useRef } from 'react';
import { StoreApi, createStore } from 'zustand';

import { StoreProviderProps } from './interface';
import { PositionState } from './position';

import { apiEndpoint } from '@/config/env';
import { mockCompanyInfo } from '@/data/mock';
import { axiosInstance } from '@/lib/client';
import { usePositionStore } from '@/store/store';

export interface CompanyState {
  id: string;
  name: string;
  email: string;
  github_username: string;
  repository_names: string[];
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
      ...mockCompanyInfo,
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
  const positionStore: PositionState = usePositionStore();

  const storeRef = useRef(
    createStore<CompanyState>()(set => ({
      id: '',
      name: '',
      email: '',
      github_username: '',
      repository_names: [],
      me: async () => {
        try {
          const res = await axiosInstance.get(`${apiEndpoint}/companies/me`);
          if (res.data.status === 'success') {
            const payload = res.data.payload;
            set({
              id: payload.id,
              name: payload.name,
              email: payload.email,
              github_username: payload.github_username,
              repository_names: payload.repository_names,
            });
            await positionStore.setPositions(payload.positions);
            await positionStore.selectPosition(payload.positions[0]);
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
          github_username: '',
          repository_names: [],
        }),
    }))
  );

  return (
    <CompanyStoreContext.Provider value={storeRef.current}>
      {children}
    </CompanyStoreContext.Provider>
  );
};
