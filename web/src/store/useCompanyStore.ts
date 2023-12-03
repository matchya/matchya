import axios from 'axios'
import { create } from 'zustand'

import { apiEndpoint } from '../config'
import { Position } from '../types'

interface CompanyState {   
    id: string
    name: string
    email: string
    github_username: string
    repository_names: string[]
    positions: Position[]
    me: () => void
}

export const useCompanyStore = create<CompanyState>((set) => ({
    id: '',
    name: '',
    email: '',
    github_username: '',
    repository_names: [],
    positions: [],
    me: async () => {
        const res = await axios.get(`${apiEndpoint}/companies/me`, { withCredentials: true })
        if (res.data.status === 'success') {
            const payload = res.data.payload
            set({
                id: payload.id,
                name: payload.name,
                email: payload.email,
                github_username: payload.github_username,
                repository_names: payload.repository_names,
                positions: payload.positions,
            })
        } else {
            throw new Error(res.data.payload.message)
        }
    }
}))
