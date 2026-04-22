import axios from '@/services/api.js'

class MobOviService {
  async sync(data) {
    try {
      const res = await axios.post('/api/mobile/syncOvi', data)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getMobOvi(id) {
    try {
      const res = await axios.get(`/api/mobile/mobOvi/${id}`)
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
      const res = await axios.put('/api/mobile/mobOvi', data)
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
      const res = await axios.delete(`/api/mobile/mobOvi/${id}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getMobOvis(filter) {
    try {
      const res = await axios.get(`/api/mobile/mobOvis/${filter}`)
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

export default new MobOviService()
