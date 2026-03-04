import axios from '@/services/api.js'

class DownloadsService {
  async getTree() {
    try {
      const res = await axios.get(`/api/general/downloads`)
      return res.data
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }

  async getFile(file) {
    try {
      const res = await axios.get(`/api/general/download/${file}`, {
        responseType: 'blob', // ESSENCIAL: diz ao axios para manter os dados binários
      })

      // Criamos uma URL temporária que aponta para o arquivo na memória do navegador
      return window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' }
      }
    }
  }
}

export default new DownloadsService()
