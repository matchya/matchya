import { create } from 'zustand'


interface AuthState {   
    accessToken: string
    initAuth: () => void
    setAccessToken: (token: string) => void
    removeAccessToken: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: '',
    initAuth: () => {
        const accessToken = localStorage.getItem('accessToken')
        // TODO: check if token is expired
        if (accessToken) {
            set({ accessToken })
        }
    },
    setAccessToken: (accessToken) => {
        set({ accessToken })
        localStorage.setItem('accessToken', accessToken)
    },
    removeAccessToken: () => {
        set({ accessToken: '' })
        localStorage.removeItem('accessToken')
    },
}))