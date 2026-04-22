import axios from '@/services/api.js'

class AreaNavService {
  async create(data) {
    try {
      const res = await axios.post('/api/cadastro/areaNav', data)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getAreaNav(id) {
    try {
      const res = await axios.get(`/api/cadastro/areaNav/${id}`)
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
      const res = await axios.put('/api/cadastro/areaNav', data)
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
      const res = await axios.delete(`/api/cadastro/areaNav/${id}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getAreaNavs(filter) {
    try {
      const res = await axios.get(`/api/cadastro/areaNavs/${filter}`)
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
      const res = await axios.get(`/api/cadastro/comboAreaNav/${filter}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getComboQuart(id) {
    try {
      const res = await axios.get(`/api/cadastro/comboQuartNav/${id}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getDuplica(filter) {
    try {
      const res = await axios.get(`/api/cadastro/duplicaAreaNav/${filter}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async troca(data) {
    try {
      const res = await axios.post('/api/cadastro/trocaAreaNav', data)
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

export default new AreaNavService()
