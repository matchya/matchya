import { createContext, useRef } from 'react';
import { createStore } from 'zustand';

import { apiEndpoint } from '../config';

import { axiosInstance } from '@/helper';
import { usePositionStore } from '@/store/store';

interface CompanyState {
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

interface CompanyStoreProviderProps {
  children: React.ReactNode;
}

export const StorybookCompanyStoreProvider = ({
  children,
}: CompanyStoreProviderProps) => {
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

export const CompanyStoreProvider = ({
  children,
}: CompanyStoreProviderProps) => {
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
            console.log('WHAT1');
            await positionStore.setPositions(payload.positions);
            console.log('WHAT2');
            await positionStore.selectPosition(payload.positions[0]);
            console.log('WHAT3');
          } else {
            console.log('WHAT4');
            throw new Error(res.data.payload.message);
          }
        } catch (err) {
          console.log('WHAT5');
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
  const positionStore = usePositionStore();

  return (
    <CompanyStoreContext.Provider value={storeRef.current}>
      {children}
    </CompanyStoreContext.Provider>
  );
};
