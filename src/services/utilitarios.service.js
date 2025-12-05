import axios from '@/services/api.js'

class UtilitariosService {
  async sorteio(filtros) {
    try {
      const res = await axios.post(`/api/utilitarios/sorteio`, filtros)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async boletimFolha(id) {
    try {
      const res = await axios.get(`/api/utilitarios/boletimFolha/${id}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async boletimMobFolha(id) {
    try {
      const res = await axios.get(`/api/utilitarios/boletimMobFolha/${id}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async boletimImovel(id) {
    try {
      const res = await axios.get(`/api/utilitarios/boletimImovel/${id}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async boletimMobImovel(id) {
    try {
      const res = await axios.get(`/api/utilitarios/boletimMobImovel/${id}`)
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

export default new UtilitariosService()
