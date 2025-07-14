// stores/auth.js
import { defineStore } from 'pinia'
import AuthService from '@/services/auth.service'

const userFromStorage = JSON.parse(localStorage.getItem('user'))

export const useAuthStore = defineStore('auth', {
  state: () => ({
    status: {
      loggedIn: !!userFromStorage
    },
    user: userFromStorage || null
  }),

  getters: {
    stateToken: (state) => state.user?.token,
    stateUser: (state) => state.user?.id,
    loggedUser: (state) => state.user,
    isLogged: (state) => state.status.loggedIn
  },

  actions: {
    async login(userData) {
      try {
        const user = await AuthService.login(userData)
        if (user.token) {
          this.status.loggedIn = true
          this.user = user
          return user
        } else {
          this.status.loggedIn = false
          this.user = null
          return Promise.reject(user.message)
        }
      } catch (error) {
        this.status.loggedIn = false
        this.user = null
        return Promise.reject(error)
      }
    },

    logout() {
      AuthService.logout()
      this.status.loggedIn = false
      this.user = null
    },

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
    }
  }
})
