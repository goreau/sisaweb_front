import { defineStore } from 'pinia'

export const useVcBriStore = defineStore('objeto', {
  state: () => ({
    objetoBri: null
  }),
  actions: {
    setFolha(obj) {
      this.objetoBri = obj
    },
    updateImoveis(imoveis) {
      if (this.objetoBri) {
        this.objetoBri.imoveis = imoveis
      }
    },
  }
})
