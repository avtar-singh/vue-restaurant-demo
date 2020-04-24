import axios from 'axios';
import store from '@/store';

// API URL
const apiBaseUrl = process.env.VUE_APP_AUTH_URL
  ? process.env.VUE_APP_AUTH_URL
  : "http://127.0.0.1:8000";

/**
 * Axios basic configuration
 * Some general configuration can be added like timeout, headers, params etc. More details can be found on https://github.com/axios/axios
 * */
const config = {
  baseURL: apiBaseUrl
};

/**
 * Creating the instance of Axios
 * It is because, in large scale application we may need to consume APIs from more than single server,
 * So, may need to create multiple http client with different config
 * Only this client will be used rather than axios in the application
 **/
const httpClient = axios.create(config);
/**
 * Auth interceptors
 * @description Configuration related to AUTH token can be done in interceptors.
 * Currenlty it is just doing nothing but idea to to show the capability of axios and its interceptors
 * In future, interceptors can be created into separate files and consumed into multiple http clients
 * @param {*} config
 */
//Add a response interceptor
httpClient.interceptors.response.use((response) => {
  return response
}, function (error) {
  // Save Original Request
  const originalRequest = error.config;

  // If Error 401 [Token]
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    // Create New Token
    return httpClient.post(`${apiBaseUrl}/v1/auth/refresh-tokens`, {
      "refreshToken": localStorage.getItem('refresh_token')
    })
      .then(resp => {
        if (resp.status === 200) {
          const token = resp.data.access.token;
          // Add Token to Normal Header
          httpClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          // Add Token to Original Request Header
          originalRequest.headers.Authorization = `Bearer ${token}`;
          // Set Token - Simple
          localStorage.setItem('access_token', resp.data.access.token)
          // Set Token - Refresh
          localStorage.setItem('refresh_token', resp.data.refresh.token)
          store.commit('token_update_success', token);
          // Re-Call Original Request
          return httpClient(originalRequest);
        }
      });
  }
  return Promise.reject(error);
});

export { httpClient };