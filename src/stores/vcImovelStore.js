import { defineStore } from 'pinia'

export const useVcImovelStore = defineStore('objeto', {
  state: () => ({
    visita: null // { id, data, ... }
  }),

  actions: {
    setVisita(obj) {
      this.visita = obj
    },

    addImovel(imovel) {
      if (!this.visita?.imoveis) this.visita.imoveis = []
      this.visita.imoveis.push(imovel)
    },

    updateRecipientes(idImovel, recipientes) {
      const imovel = this.visita?.imoveis?.find(i => i.id === idImovel)
      if (imovel) {
        imovel.recipientes = recipientes
      }
    }
  }
})
