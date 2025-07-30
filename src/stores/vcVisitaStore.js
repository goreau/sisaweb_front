import { defineStore } from 'pinia'

export const useVcVisitaStore = defineStore('objeto', {
  state: () => ({
    objetoFolha: null
  }),
  actions: {
    setFolha(obj) {
      this.objetoFolha = obj
    },
    addImovel(imovel) {
      if (!this.objetoFolha?.imoveis) this.objetoFolha.imoveis = []
      this.objetoFolha.imoveis.push(imovel)
    },
    updateImoveis(imoveis) {
      if (this.objetoFolha) {
        this.objetoFolha.imoveis = imoveis
      }
    },
    updateRecipientes(idImovel, recipientes) {
      const imovel = this.visita?.imoveis?.find(i => i.id === idImovel)
      if (imovel) {
        imovel.recipientes = recipientes
      }
    }
  }
})
