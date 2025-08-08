import { defineStore } from 'pinia'

export const useVcAladoStore = defineStore('vcAlado', {
  state: () => ({
    objetoAlado: null
  }),
  actions: {
    setFolha(obj) {
      this.objetoAlado = obj
    },
    updateImoveis(imoveis) {
      if (this.objetoAlado) {
        this.objetoAlado.imoveis = imoveis
      }
    },
  }
})
