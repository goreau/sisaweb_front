import axios from '@/services/api.js'

const apiSistema = axios.create({
  baseURL: `${import.meta.env.VITE_SISAPI_URL}api/sistema/`,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_SISAPI_KEY}`,
  },
})

function tratarErro(error) {
  const mensagemErro = error.response?.data || 'Erro desconhecido'
  return { error: true, msg: mensagemErro }
}

function queryStringParaObjeto(queryString) {
  const params = new URLSearchParams(String(queryString).trim().replace(/^\?/, ''))
  const obj = {}

  for (const [chave, valor] of params.entries()) {
    obj[chave] = valor
  }

  return obj
}

class ContaOvosService {
  async getTesteGen() {
    try {
      const response = await apiSistema.get('testecron', {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      return tratarErro(error)
    }
  }
  async getListaLog(filter) {
    try {
      const response = await apiSistema.get('contalogs', {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json',
        },
        data: filter,
      })

      return response.data
    } catch (error) {
      return tratarErro(error)
    }
  }

  async getLogFile(file) {
    try {
      const response = await apiSistema.get(`contalogfile/${file}`, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'blob',
        },
      })

      return response.data
    } catch (error) {
      return tratarErro(error)
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

  async deleteReg(id) {
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

  async _enviarParaEndpoint(endpoint, data) {
    try {
      const payload = queryStringParaObjeto(data)

      const response = await apiSistema.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      return response.data
    } catch (error) {
      return tratarErro(error)
    }
  }

  postEndpoint(endpoint, data) {
    return this._enviarParaEndpoint(endpoint, data)
  }

  async getTesteCron() {
    try {
      const response = await apiSistema.get('testecron')
      return response.data
    } catch (error) {
      return tratarErro(error)
    }
  }

  async getOrfaos() {
    try {
      const res = await axios.get(`/api/cadastro/getorfaos`)
      return res
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getErros(id) {
    try {
      const res = await axios.get(`/api/cadastro/getErros/${id}`)
      return res
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
