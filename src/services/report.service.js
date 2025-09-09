import axios from "@/services/api.js";

class ReportService {
  async getConfig(tipo, nome) {
    try {
      const res = await axios.get(`/api/report/getConfig/${tipo}/${nome}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getData(tipo, nome, filtros) {
    try {
      const res = await axios.post(`/api/report/getData/${tipo}/${nome}`, filtros);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getVariaveis(tipo) {
    try {
      const res = await axios.get(`/api/report/getVariaveis/${tipo}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getCrossVars() {
    try {
      const res = await axios.get(`/api/report/getCrossVar`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getCrossTab(opcoes) {
    try {
      const res = await axios.post(`/api/report/getCrossTab`, opcoes);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }
}

export default new ReportService();
