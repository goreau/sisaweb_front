import { defineStore } from 'pinia'

export const useAreaNavStore = defineStore('objeto', {
  state: () => ({
    objetoPrincipal: null
  }),
  actions: {
    setObjeto(obj) {
      this.objetoPrincipal = obj
    },
    setFilhos(filhos) {
      if (this.objetoPrincipal) {
        this.objetoPrincipal.filhos = filhos
      }
    }
  }
})
