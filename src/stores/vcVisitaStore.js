import { defineStore } from 'pinia'

export const useVcVisitaStore = defineStore('vcVisita', {
  state: () => ({
    objetoFolha: null,
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
      //  const imovel = this.objetoFolha?.imoveis?.find((i) => i.id === idImovel)
      const imovel = this.objetoFolha?.imoveis?.find((i) => {
        // Se o ID buscado for um número válido (ou string numérica "12")
        if (!isNaN(idImovel) && !isNaN(i.id)) {
          return Number(i.id) === Number(idImovel)
        }

        // Se for string temporária (ex: "temp-987"), compara como String
        return String(i.id) === String(idImovel)
      })
      if (imovel) {
        imovel.recipientes = recipientes
      }
    },
  },
})
