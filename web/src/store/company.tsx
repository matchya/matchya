import { createContext, useRef } from 'react';
import { createStore } from 'zustand';

import { apiEndpoint } from '../config';

import { StoreProviderProps } from './interface';
import { PositionState } from './position';

import { axiosInstance } from '@/helper';
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

export const StorybookCompanyStoreContext = createContext(null);
export const CompanyStoreContext = createContext(null);

export const StorybookCompanyStoreProvider = ({
  children,
}: StoreProviderProps) => {
  const storeRef = useRef(
    createStore<CompanyState>(() => ({
      id: '12398723948',
      name: 'Peter Parker',
      email: 'peterparker@gmail.com',
      github_username: 'peterparker',
      repository_names: ['repo1', 'repo2', 'repo3'],
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
