import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    back_api: import.meta.env.VITE_BACK_API // adaptação do process.env do Vite
  })
})
