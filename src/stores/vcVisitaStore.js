import { defineStore } from 'pinia'

export const useVcVisitaStore = defineStore('vcVisita', {
  state: () => ({
    objetoFolha: null,
    isDirty: false,
  }),
  actions: {
    setFolha(obj) {
      this.objetoFolha = obj
    },
    addImovel(imovel) {
      if (!this.objetoFolha?.imoveis) this.objetoFolha.imoveis = []
      this.objetoFolha.imoveis.push(imovel)
      this.marcarSujo()
    },
    updateImoveis(imoveis) {
      if (this.objetoFolha) {
        this.objetoFolha.imoveis = imoveis
        this.marcarSujo()
      }
    },
    updateRecipientes(idImovel, recipientes) {
      const imovel = this.objetoFolha?.imoveis?.find((i) => {
        // Se o ID buscado for um número válido (ou string numérica "12")
        if (!isNaN(idImovel) && !isNaN(i.id)) {
          return Number(i.id) === Number(idImovel)
        }

        // Se for string temporária (ex: "temp-987"), compara como String
        return String(i.id) === String(idImovel)
      })

      if (imovel) {
        // 1. Atualiza o array de recipientes do imóvel
        imovel.recipientes = [...recipientes]

        // 2. Calcula a string de amostras automaticamente no Store
        // Mapeia, faz o trim, remove vazios e junta com vírgula e espaço
        const listaAmostras = imovel.recipientes
          .map((r) => (r.amostra ? String(r.amostra).trim() : ''))
          .filter((a) => a !== '')

        // Atribui o resultado direto ao campo que a View 2 consome na tabela
        imovel.amostras = listaAmostras.join(', ')

        this.isDirty = true
      }
    },
    marcarSujo() {
      this.isDirty = true
    },
    resetarDirty() {
      this.isDirty = false
    },
  },
})
