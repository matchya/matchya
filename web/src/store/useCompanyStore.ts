import axios from 'axios';
import { create } from 'zustand';

import { apiEndpoint } from '../config';

import { usePositionStore } from './usePositionStore';
interface CompanyState {
  id: string;
  name: string;
  email: string;
  github_username: string;
  repository_names: string[];
  me: () => void;
  resetAll: () => void;
}

export const useCompanyStore = create<CompanyState>(set => ({
  id: '',
  name: '',
  email: '',
  github_username: '',
  repository_names: [],
  me: async () => {
    try {
      const res = await axios.get(`${apiEndpoint}/companies/me`, {
        withCredentials: true,
      });
      if (res.data.status === 'success') {
        const payload = res.data.payload;
        set({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          github_username: payload.github_username,
          repository_names: payload.repository_names,
        });
        await usePositionStore.getState().setPositions(payload.positions);
        await usePositionStore.getState().selectPosition(payload.positions[0]);
        await usePositionStore.getState().setPositionDetail(payload.positions[0].id);
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
}));
