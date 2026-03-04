import axios from '@/services/api.js'

class UniformizaUserService {
  async getData(filter) {
    try {
      const res = await axios.get(`/api/gerenciamento/uniformiza/${filter}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async update(filter) {
    try {
      const res = await axios.put('/api/gerenciamento/uniformiza', filter)
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

export default new UniformizaUserService()
