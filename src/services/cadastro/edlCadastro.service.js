import axios from "@/services/api.js";

class EdlCadastroService {
  async create(data) {
    try {
      const res = await axios.post("/api/cadastro/edlCadastro", data);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getEdlCadastro(id) {
    try {
      const res = await axios.get(`/api/cadastro/edlCadastro/${id}`);
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
      const res = await axios.put("/api/cadastro/edlCadastro", data);
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
      const res = await axios.delete(`/api/cadastro/edlCadastro/${id}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getEdlCadastros(filter) {
    try {
      const res = await axios.get(`/api/cadastro/edlCadastros/${filter}`);
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
      const res = await axios.get(`/api/cadastro/comboEdlCadastro/${filter}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getDuplica(filter) {
    try {
      const res = await axios.get(`/api/cadastro/duplicaEdlCadastro/${filter}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async troca(data) {
    try {
      const res = await axios.post('/api/cadastro/trocaEdlCadastro', data);
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

export default new EdlCadastroService();
