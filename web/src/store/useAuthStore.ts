import { create } from 'zustand'


interface AuthState {   
    accessToken: string
    setAccessToken: (token: string) => void
    resetAccessToken: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: '',
    setAccessToken: (accessToken) => set({ accessToken }),
    resetAccessToken: () => set({ accessToken: '' }),
}))