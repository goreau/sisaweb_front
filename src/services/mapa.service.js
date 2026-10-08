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
        // Permite que status 404 passem como resposta normal em vez de estourar exceção/interceptor
        validateStatus: (status) => status < 500,
      })

      if (res.status === 404) {
        return { error: true, msg: 'Arquivo de mapa não encontrado para este município.' }
      }

      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: true, msg: error.response.data }
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getMapaOrig(dados) {
    try {
      const res = await axios.post(`/api/mapa/mapa`, dados, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: true, msg: error.response.data }
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

  async getColegiado(id) {
    try {
      const res = await axios.get(`/api/mapa/colegiado_por_mun/${id}`)
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
