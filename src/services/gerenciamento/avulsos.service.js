import axios from "@/services/api.js";

class AvulsosService {
  async getDuplicaCad(filter) {
    try {
      const res = await axios.get(`/api/avulso/getUserCad/${filter}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async trocaCad(data) {
    try {
      const res = await axios.post('/api/avulso/trocaUserCad', data);
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

export default new AvulsosService();
