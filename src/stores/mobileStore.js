import { defineStore } from 'pinia'

export const useMobileStore = defineStore('objeto', {
  state: () => ({
    visita: null // { id, data, ... }
  }),

  actions: {
    setVisita(obj) {
      this.visita = obj
    },

    updateRecipientes(recipientes) {
      if (this.visita) {
        this.visita.recipientes = recipientes
      }
    }
  }
})
