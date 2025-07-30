import axios from "@/services/api.js";

class CicloService {
  async create(data) {
    try {
      const res = await axios.post("/api/gerenciamento/ciclo", data);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getCiclo(id) {
    try {
      const res = await axios.get(`/api/gerenciamento/ciclo/${id}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async update(data) {
    try {
      const res = await axios.put("/api/gerenciamento/ciclo", data);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async delete(id) {
    try {
      const res = await axios.delete(`/api/gerenciamento/ciclo/${id}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }


  async getCiclos(filter) {
    try {
      const res = await axios.get(`/api/gerenciamento/ciclos/${filter}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getCombo(filter) {
    try {
      const res = await axios.get(`/api/gerenciamento/comboCiclo/${filter}`);
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

export default new CicloService();
