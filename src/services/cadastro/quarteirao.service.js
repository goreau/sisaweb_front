import axios from "@/services/api.js";

class QuarteiraoService {
  create(data) {
    return axios.post("/quarteirao", data)
      .then(response => {
        return response;
      },
        (error) => {
          throw new Error(error.data.msg);
        })
  }

  getQuarteirao(id) {
    return axios.get(`/quarteirao/${id}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error;
        })
  }

  update(data) {
    return axios.put("/quarteirao", data)
      .then(response => {
        return response;
      },
        (error) => {
          throw new Error(error.data.msg);
        })
  }

  delete(id) {
    return axios.delete(`/quarteirao/${id}`)
      .then(response => {
        return response;
      },
        (error) => {
          return error.data;
        })
  }

  getQuarteiraos(filter) {
    return axios.get(`/quarteiraos/${filter}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error.response.data;
        })
  }

  getCombo(filter) {
    return axios.get(`/comboQuarteirao/${filter}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error.response.data;
        })
  }

}

export default new QuarteiraoService();
