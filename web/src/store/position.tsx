import { createContext, useRef } from 'react';
import { StoreApi, createStore } from 'zustand';

import { StoreProviderProps } from './interface';

import { mockedPositions, mockedSelectedPosition } from '@/data/mock';
import { axiosInstance } from '@/lib/client';
import { Candidate, CustomError, Position } from '@/types';

export interface PositionState {
  setupRequired: boolean;
  setupPosition: (setup: boolean) => void;
  positions: Position[];
  setPositions: (positions: Position[]) => void;
  selectedPosition: Position | null;
  selectPosition: (position: Position) => void;
  setPositionDetail: (positionId: string) => Promise<void>;
  selectedCandidate: Candidate | null;
  selectCandidate: (candidate: Candidate) => void;
  updateCandidates: (candidates: Candidate[]) => void;
  resetAll: () => void;
}

export const StorybookPositionStoreContext =
  createContext<StoreApi<PositionState> | null>(null);
export const PositionStoreContext =
  createContext<StoreApi<PositionState> | null>(null);

export const StorybookPositionStoreProvider = ({
  children,
}: StoreProviderProps) => {
  const storeRef = useRef(
    createStore<PositionState>(() => ({
      setupRequired: false,
      setupPosition: () => alert('Setup position'),
      positions: mockedPositions,
      setPositions: () => alert('Set positions'),
      selectedPosition: mockedSelectedPosition,
      selectPosition: () => alert('Select position'),
      setPositionDetail: async () => alert('Set position detail'),
      selectedCandidate: null,
      selectCandidate: () => alert('Select candidate'),
      updateCandidates: () => alert('update Candidate'),
      resetAll: () => {},
    }))
  );

  return (
    <StorybookPositionStoreContext.Provider value={storeRef.current}>
      {children}
    </StorybookPositionStoreContext.Provider>
  );
};

export const PositionStoreProvider = ({ children }: StoreProviderProps) => {
  const storeRef = useRef(
    createStore<PositionState>((set, get) => ({
      setupRequired: false,
      setupPosition: (setup: boolean) => {
        set({ setupRequired: setup });
      },
      positions: [],
      setPositions: (positions: Position[]) => {
        set({ positions });
      },
      selectedPosition: null,
      selectPosition: (position: Position) => {
        set({ selectedPosition: position }),
          get().setPositionDetail(position.id);
      },
      setPositionDetail: async (positionId: string) => {
        try {
          const selectedPosition = get().selectedPosition;
          if (!selectedPosition) {
            throw new Error('No position selected');
          }
          const res = await axiosInstance.get(`/positions/${positionId}`, {
            withCredentials: true,
          });
          if (res.data.status === 'success') {
            set({
              selectedPosition: {
                ...selectedPosition,
                checklist_status: res.data.payload.checklist_status,
                checklist: res.data.payload.checklist,
              },
            });
          } else {
            throw new Error(res.data.payload.message);
          }
        } catch (err) {
          const error = err as CustomError;
          if (error.response && error.response.data) {
            console.error(error.response.data.message);
          }
          throw new Error();
        }
        return;
      },
      selectedCandidate: null,
      selectCandidate: (candidate: Candidate) =>
        set({ selectedCandidate: candidate }),
      updateCandidates: (candidates: Candidate[]) => {
        const selectedPosition = get().selectedPosition;
        if (!selectedPosition || !selectedPosition.checklist) {
          return;
        }
        set({
          selectedPosition: {
            ...selectedPosition,
          },
        });

        const selectedCandidate = get().selectedCandidate;
        if (selectedCandidate) {
          const updatedCandidate = candidates.find(
            candidate => candidate.id === selectedCandidate.id
          );
          if (updatedCandidate) {
            set({ selectedCandidate: updatedCandidate });
          }
        }
      },
      resetAll: () =>
        set({ positions: [], selectedPosition: null, selectedCandidate: null }),
    }))
  );

  return (
    <PositionStoreContext.Provider value={storeRef.current}>
      {children}
    </PositionStoreContext.Provider>
  );
};
