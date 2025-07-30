import axios from "@/services/api.js";

class AuxilliarService {
  async getGenericCombo(tabela) {
    try {
      const res = await axios.get(`/api/general/genericCombo/${tabela}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getAtividadeImCombo(tabela, tag) {
    try {
      const res = await axios.get(`/api/general/atividadeImCombo/${tabela}/${tag}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getAtividadeCombo(tabela) {
    try {
      const res = await axios.get(`/api/general/atividadeCombo/${tabela}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getGrupoRecCombo() {
    try {
      const res = await axios.get(`/api/general/grupoRecipiente`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getTipoRecCombo(grupo) {
    try {
      const res = await axios.get(`/api/general/tipoRecipiente/${grupo}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getAuxOvitrampa(tipo) {
    try {
      const res = await axios.get(`/api/general/auxOvitrampa/${tipo}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
  }

  async getProdutoCombo(tipo) {
    try {
      const res = await axios.get(`/api/general/produtoCombo/${tipo}`);
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

export default new AuxilliarService();
