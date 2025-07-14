import axios from "@/services/api.js";

class AreaService {
  create(data) {
    return axios.post("/area", data)
      .then(response => {
        return response;
      },
        (error) => {
          throw new Error(error.data.msg);
        })
  }

  getArea(id) {
    return axios.get(`/area/${id}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error;
        })
  }

  update(data) {
    return axios.put("/area", data)
      .then(response => {
        return response;
      },
        (error) => {
          throw new Error(error.data.msg);
        })
  }

  delete(id) {
    return axios.delete(`/area/${id}`)
      .then(response => {
        return response;
      },
        (error) => {
          return error.data;
        })
  }

  getAreas(filter) {
    return axios.get(`/areas/${filter}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error.response.data;
        })
  }

  getCombo(filter) {
    return axios.get(`/comboArea/${filter}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error.response.data;
        })
  }

}

export default new AreaService();
