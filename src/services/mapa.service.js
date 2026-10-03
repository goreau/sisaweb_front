import axios from '@/services/api.js'

class MapaService {
  async getFontes() {
    try {
      const res = await axios.get(`/api/mapa/fontes`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }
  async getMapa(dados) {
    try {
      const res = await axios.post(`/api/mapa/mapa`, dados, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getData(dados) {
    try {
      const res = await axios.post(`/api/mapa/dados`, dados)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }
}

export default new MapaService()
