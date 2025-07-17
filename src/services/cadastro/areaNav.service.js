import axios from "@/services/api.js";

class AreaNavService {
  create(data) {
    return axios.post("/areaNav", data)
      .then(response => {
        return response;
      },
        (error) => {
          throw new Error(error.data.msg);
        })
  }

  getAreaNav(id) {
    return axios.get(`/areaNav/${id}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error;
        })
  }

  update(data) {
    return axios.put("/areaNav", data)
      .then(response => {
        return response;
      },
        (error) => {
          throw new Error(error.data.msg);
        })
  }

  delete(id) {
    return axios.delete(`/areaNav/${id}`)
      .then(response => {
        return response;
      },
        (error) => {
          return error.data;
        })
  }

  getAreaNavs(filter) {
    return axios.get(`/areaNavs/${filter}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error.response.data;
        })
  }

  getCombo(filter) {
    return axios.get(`/comboAreaNav/${filter}`)
      .then(response => {
        return { data: response.data };
      },
        (error) => {
          return error.response.data;
        })
  }

}

export default new AreaNavService();
