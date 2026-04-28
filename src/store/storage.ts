type StorageValue = string | null

type PersistStorage = {
  getItem: (key: string) => Promise<StorageValue>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

const createNoopStorage = (): PersistStorage => ({
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined,
})

const createWebStorage = (): PersistStorage => {
  if (typeof window === 'undefined') {
    return createNoopStorage()
  }

  return {
    getItem: async (key) => window.localStorage.getItem(key),
    setItem: async (key, value) => {
      window.localStorage.setItem(key, value)
    },
    removeItem: async (key) => {
      window.localStorage.removeItem(key)
    },
  }
}

export const storage = createWebStorage()
