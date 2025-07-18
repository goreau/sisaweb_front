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

  async delete(id) {
    try {
      const res = await axios.delete(`/areaNav/${id}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return { error: true, msg: 'Erro de comunicação com o servidor.' };
      }
    }
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
