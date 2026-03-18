import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    isDirty: false,
  }),
  actions: {
    setDirty(value) {
      this.isDirty = value
    },
  },
})
