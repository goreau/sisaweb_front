import axios from "@/services/api.js";

class ImovelService {
  create(data) {
    return axios.post("/imovel", data)
      .then(response => {
        return response;
      },
        (error) => {
          throw new Error(error.data.msg);
        })
  }

  getImovel(id) {
    return axios.get(`/imovel/${id}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error;
        })
  }

  update(data) {
    return axios.put("/imovel", data)
      .then(response => {
        return response;
      },
        (error) => {
          throw new Error(error.data.msg);
        })
  }

  delete(id) {
    return axios.delete(`/imovel/${id}`)
      .then(response => {
        return response;
      },
        (error) => {
          return error.data;
        })
  }

  getImovels(filter) {
    return axios.get(`/imovels/${filter}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error.response.data;
        })
  }

  getCombo(filter) {
    return axios.get(`/comboImovel/${filter}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error.response.data;
        })
  }

}

export default new ImovelService();
