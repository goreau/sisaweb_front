import axios from '@/services/api.js'

class ContaOvosService {
  async getListaLog(filter) {
    try {
      const link = `${import.meta.env.VITE_SISAPI_URL}api/sistema/contalogs/`
      console.log(link)
      console.log(`Bearer ${import.meta.env.VITE_SISAPI_KEY}`)

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: link, ///'https://sisapi.saude.sp.gov.br/api/recebe/logs', //'http://10.8.150.23:4033/api/recebe/logs', //
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SISAPI_KEY}`,
        },
        data: filter,
      }

      return axios
        .request(config)
        .then((response) => {
          //logs.value(JSON.stringify(response.data))
          return response.data
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async getLogFile(file) {
    try {
      const link = `${import.meta.env.VITE_SISAPI_URL}api/sistema/contalogfile/${file}`

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: link, ///'https://sisapi.saude.sp.gov.br/api/recebe/logs', //'http://10.8.150.23:4033/api/recebe/logs', //
        headers: {
          'Content-Type': 'blob',
          Authorization: `Bearer ${import.meta.env.VITE_SISAPI_KEY}`,
        },
      }

      return axios
        .request(config)
        .then((response) => {
          //logs.value(JSON.stringify(response.data))
          return response.data
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async create(data) {
    try {
      const res = await axios.post('/api/cadastro/contaovos', data)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getContaOvos(id) {
    try {
      const res = await axios.get(`/api/cadastro/contaovos/${id}`)
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
      const res = await axios.put('/api/cadastro/contaovos', data)
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
      const res = await axios.delete(`/api/cadastro/contaovos/${id}`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getContaOvosList(filter) {
    try {
      const res = await axios.get(`/api/cadastro/contaovoss/${filter}`)
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

export default new ContaOvosService()
