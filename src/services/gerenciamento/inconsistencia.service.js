import axios from '@/services/api.js'

class InconsistenciaService {
  async get(filter) {
    try {
      const res = await axios.get(`/api/gerenciamento/inconsistencia/${filter}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getOptions() {
    try {
      const res = await axios.get(`/api/gerenciamento/incons_option`)
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

export default new InconsistenciaService()
