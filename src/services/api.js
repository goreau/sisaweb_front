import axios from "axios";
import authService from "./auth.service";
import router from '../router'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACK_API,
});

api.interceptors.request.use(
  config => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    //console.log(this.$router)
    if (error.response.status) {
      switch (error.response.status) {
        /* case 400:
           alert(error.response.data.message);
          //do something
      //     return Promise.resolve({ error: error.response.data });
           break;  */
        case 401:
          authService.logout();
          router.replace({
            path: "/login",
            query: { redirect: router.currentRoute.fullPath }
          });
          break;
        case 403:
          authService.logout();
          router.replace({
            path: "/login",
            query: { redirect: router.currentRoute.fullPath }
          });
          break;
        case 404:
          alert('page not exist');
          break;
        case 502:
          setTimeout(() => {
            router.replace({
              path: "/login",
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 1000);
      }
      return Promise.reject(error);

    }
  }
);

export default api;
