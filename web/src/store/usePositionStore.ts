import { create } from "zustand";

import { axiosInstance } from "@/helper";
import { Candidate, Position } from "@/types";


interface PositionState {
    positions: Position[];
    setPositions: (positions: Position[]) => void;
    selectedPosition: Position | null;
    selectPosition: (position: Position) => void;
    setPositionDetail: (positionId: string) => Promise<void>;
    selectedCandidate: Candidate | null;
    selectCandidate: (candidate: Candidate) => void;
    resetAll: () => void;
}

export const usePositionStore = create<PositionState>((set, get) => ({
    positions: [],
    setPositions: (positions: Position[]) => set({ positions }),
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
            const res = await axiosInstance.get(
                `/positions/${positionId}`,
                {
                    withCredentials: true,
                }
            );
            if (res.data.status === 'success') {
                set({
                    selectedPosition: {
                        ...selectedPosition,
                        checklist_status: res.data.payload.checklist_status,
                        checklist: res.data.payload.checklists[0],
                    },
                });
            } else {
                throw new Error(res.data.payload.message);
            }
        } catch (err) {
            throw new Error();
        }
        return;
    },
    selectedCandidate: null,
    selectCandidate: (candidate: Candidate) => set({ selectedCandidate: candidate }),
    resetAll: () => set({ positions: [], selectedPosition: null, selectedCandidate: null }),
}));