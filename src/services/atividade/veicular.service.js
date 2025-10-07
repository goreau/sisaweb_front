import axios from '@/services/api.js'

class VeicularService {
  async create(data) {
    try {
      const res = await axios.post('/api/atividades/veicular', data)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getVeicular(id) {
    try {
      const res = await axios.get(`/api/atividades/veicular/${id}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async update(data) {
    try {
      const res = await axios.put('/api/atividades/veicular', data)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async delete(id) {
    try {
      const res = await axios.delete(`/api/atividades/veicular/${id}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getVeiculars(filter) {
    try {
      const res = await axios.get(`/api/atividades/veiculars/${filter}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getCombo(filter) {
    try {
      const res = await axios.get(`/api/atividades/comboVeicular/${filter}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getPrevisao(filter) {
    try {
      const res = await axios.get(`/api/atividades/navPrevisao/${filter}`)
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

export default new VeicularService()
