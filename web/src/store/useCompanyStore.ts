import axios from 'axios';
import { create } from 'zustand';

import { apiEndpoint } from '../config';
import { Position } from '../types';

interface CompanyState {
  id: string;
  name: string;
  email: string;
  github_username: string;
  repository_names: string[];
  positions: Position[];
  selectedPosition: Position | null;
  selectPosition: (position: Position) => void;
  setSelectedPositionDetail: () => Promise<void>;
  me: () => void;
  resetAll: () => void;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  id: '',
  name: '',
  email: '',
  github_username: '',
  repository_names: [],
  positions: [],
  selectedPosition: null,
  selectPosition: (position: Position) => set({ selectedPosition: position }),
  setSelectedPositionDetail: async () => {
    try {
      const selectedPosition = get().selectedPosition;
      if (selectedPosition && !selectedPosition.checklists) {
        const res = await axios.get(
          `${apiEndpoint}/positions/${selectedPosition.id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.status === 'success') {
          set({
            selectedPosition: {
              ...selectedPosition,
              checklist_status: res.data.payload.checklist_status,
              checklists: res.data.payload.checklists,
            },
          });
        } else {
          throw new Error(res.data.payload.message);
        }
      }
    } catch (err) {
      throw new Error();
    }
  },
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
          positions: payload.positions,
          selectedPosition: payload.positions[0],
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
      github_username: '',
      repository_names: [],
      positions: [],
      selectedPosition: null,
    }),
}));
