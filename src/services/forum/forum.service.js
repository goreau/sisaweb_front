import axios from "@/services/api.js";

class ForumService {
  async createTopico(data) {
    try {

      const res = await axios.post("/api/forum/topico", data, { headers: { "Content-Type": "multipart/form-data" } });
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async createReplica(data) {
    try {
      const res = await axios.post("/api/forum/replica", data, { headers: { "Content-Type": "multipart/form-data" } });
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async updateTopico(data) {
    try {

      const res = await axios.put("/api/forum/topico", data);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async updateReplica(data) {
    try {
      const res = await axios.put("/api/forum/replica", data);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async delTopico(id) {
    try {

      const res = await axios.delete(`/api/forum/topico/${id}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async delReplica(id) {
    try {
      const res = await axios.delete(`/api/forum/replica/${id}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }


  async getItens() {
    try {
      const res = await axios.get(`/api/forum/itens`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getLista(filter) {
    try {
      const res = await axios.get(`/api/forum/lista/${filter}`);
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

export default new ForumService();
