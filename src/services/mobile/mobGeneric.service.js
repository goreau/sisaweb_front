import axios from "@/services/api.js";

class MobGenericService {
  async trocaExecucao(data) {
    try {
      const res = await axios.put("/api/mobile/trocaExecucao", data);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getAgentes(filter) {
    try {
      const res = await axios.get(`/api/mobile/getAgentes/${filter}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async qrCode(data) {
    try {
      const res = await axios.post("/api/mobile/qrCode", data);
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

export default new MobGenericService();
