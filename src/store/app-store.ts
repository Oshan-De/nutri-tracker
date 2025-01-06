import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppStore {
  isAuthenticated: boolean
  isLoading: boolean
  setAuthenticated: (isAuthenticated: boolean) => void
  setLoading: (isLoading: boolean) => void
}

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    isAuthenticated: false,
    isLoading: true,
    setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setLoading: (isLoading) => set({ isLoading })
  }))
)