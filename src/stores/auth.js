// stores/auth.js
import { defineStore } from 'pinia'
import AuthService from '@/services/auth.service'

const userFromStorage = JSON.parse(localStorage.getItem('user'))
const impersonatorFromStorage = JSON.parse(localStorage.getItem('impersonator'))

export const useAuthStore = defineStore('auth', {
  state: () => ({
    status: {
      loggedIn: !!userFromStorage,
    },
    user: userFromStorage || null,
    // Guarda o Admin original quando em modo Impersonate
    impersonator: impersonatorFromStorage || null,
  }),

  getters: {
    stateToken: (state) => state.user?.token,
    stateUser: (state) => state.user?.id,
    loggedUser: (state) => state.user,
    isLogged: (state) => state.status.loggedIn,

    // Novas propriedades para o Impersonate
    impersonatorUser: (state) => state.impersonator,
    isImpersonating: (state) => !!state.impersonator,
  },

  actions: {
    async login(userData) {
      try {
        const user = await AuthService.login(userData)
        if (user.token) {
          this.status.loggedIn = true
          this.user = user
          return { status: true, user }
        } else {
          this.status.loggedIn = false
          this.user = null
          return { status: false, msg: user.msg || 'Login inválido' }
        }
      } catch (error) {
        this.status.loggedIn = false
        this.user = null
        return { status: false, msg: error.msg || 'Erro de rede' }
      }
    },

    logout() {
      AuthService.logout()
      localStorage.removeItem('impersonator') // Limpa o impersonator se deslogar
      this.status.loggedIn = false
      this.user = null
      this.impersonator = null
    },

    // ----------------------------------------------------
    // MÉTODOS DE IMPERSONATE
    // ----------------------------------------------------
    startImpersonate(targetUser) {
      // 1. Salva o Admin atual como impersonator (se ainda não estiver em impersonate)
      if (!this.impersonator) {
        this.impersonator = { ...this.user }
        localStorage.setItem('impersonator', JSON.stringify(this.user))
      }

      // 2. Substitui o usuário atual pelo usuário simulado
      this.user = targetUser
      localStorage.setItem('user', JSON.stringify(targetUser))
    },

    stopImpersonate() {
      if (this.impersonator) {
        // 1. Volta o usuário para ser o Admin original
        this.user = { ...this.impersonator }
        localStorage.setItem('user', JSON.stringify(this.impersonator))

        // 2. Limpa o impersonator
        this.impersonator = null
        localStorage.removeItem('impersonator')
      }
    },
    // ----------------------------------------------------

    async register(userData) {
      try {
        const response = await AuthService.register(userData)
        this.status.loggedIn = false
        return response.data
      } catch (error) {
        this.status.loggedIn = false
        return Promise.reject(error)
      }
    },

    async update(userData) {
      try {
        const response = await AuthService.update(userData)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    newItem(msg) {
      console.log(msg)
    },
  },
})
