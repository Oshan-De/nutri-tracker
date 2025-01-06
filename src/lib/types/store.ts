import { StoreApi, UseBoundStore } from 'zustand'
import { PersistOptions } from 'zustand/middleware'

export interface WithPersist<T> {
  persist: {
    setOptions: (options: Partial<PersistOptions<T>>) => void
    clearStorage: () => void
    rehydrate: () => Promise<void>
    hasHydrated: () => boolean
    onHydrate: (fn: (state: T) => void) => () => void
    onFinishHydration: (fn: (state: T) => void) => () => void
    getOptions: () => Partial<PersistOptions<T>>
  }
}

export type PersistStore<T> = UseBoundStore<StoreApi<T>> & WithPersist<T>
