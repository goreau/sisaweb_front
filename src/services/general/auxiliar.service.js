import axios from "@/services/api.js";

class AuxilliarService {
  getGenericCombo(tabela) {
    return axios.get(`/genericCombo/${tabela}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error.response.data;
        })
  }
}

export default new AuxilliarService();
