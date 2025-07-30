import axios from "@/services/api.js";

class TerritorioService {
  async getTerritorio(id) {
    try {
      const res = await axios.get(`/api/general/territorio/${id}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getTerritorios(filter) {
    try {
      const res = await axios.get(`/api/general/territorios/${filter}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getCombo(tipo) {
    try {
      const res = await axios.get(`/api/general/localcombo/${tipo}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getComboMun(tipo) {
    try {
      const res = await axios.get(`/api/general/muncombo/${tipo}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getComboAll() {
    try {
      const res = await axios.get('/muncomboall');
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

export default new TerritorioService();
