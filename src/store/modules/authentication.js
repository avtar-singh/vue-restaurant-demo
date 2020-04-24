import axios from "axios";
import { httpClient } from "../../services/http-client.js";

const API_URL = process.env.VUE_APP_AUTH_URL
  ? process.env.VUE_APP_AUTH_URL
  : "http://127.0.0.1:8000";

const state = {
  token: localStorage.getItem("access_token") || "",
  user: JSON.parse(localStorage.getItem("user")) || "",
  temp_data: "",
};

const getters = {
  userData: (state) => state.user,
  isAuthenticated: (state) => !!state.token,
  authStatus: (state) => state.status,
  user: (state) => state.user,
  timezoneList: (state) => state.timezones,
};

const actions = {
  // Login
  login({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/auth/login`,
        data: user,
        method: "POST",
      })
        .then((resp) => {
          const token = resp.data.tokens.access.token;
          const user = resp.data.user;
          localStorage.setItem("user", JSON.stringify(user)); // Set User Object
          localStorage.setItem("access_token", resp.data.tokens.access.token); // Set Token - Access
          localStorage.setItem("refresh_token", resp.data.tokens.refresh.token); // Set Token - Refresh
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          httpClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          commit("login_success", token, user);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  logout({ commit }) {
    return new Promise((resolve) => {
      commit("auth_logout");
      localStorage.removeItem("user"); // Clear User Object
      localStorage.removeItem("access_token"); // Clear Token - Access
      localStorage.removeItem("refresh_token"); // Clear Token - Refresh
      localStorage.removeItem("current_team_id"); // Clear Token - Refresh
      delete axios.defaults.headers.common["Authorization"]; // Clear Axios Default header
      resolve();
    });
  },
  // Register
  register({ commit }, user_data) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/auth/register`,
        data: user_data,
        method: "POST",
      })
        .then((resp) => {
          const user_data = resp.data;
          commit("register_success", user_data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Change Password
  changePassword({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/auth/reset-password?token=${data.token}`,
        data: data,
        method: "POST",
      })
        .then((resp) => {
          const data = resp.data;
          commit("change_password_success", data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Verify Email
  verify({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/auth/verify?email=${data}`,
        data: data,
        method: "GET",
      })
        .then((resp) => {
          commit("verify_success");
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Forgot Password
  verifyEmail({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/auth/forgot-password`,
        data: data,
        method: "POST",
      })
        .then((resp) => {
          const data = resp.data;
          commit("verify_email_success", data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Upload Image
  updateImage({ commit }, file) {
    return new Promise((resolve, reject) => {
      httpClient({
        url: `${API_URL}/v1/users/upload`,
        data: file,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((resp) => {
          const image_url = resp.data.secure_url;
          const user = JSON.parse(localStorage.getItem("user"));
          user.image = image_url;
          localStorage.setItem("user", JSON.stringify(user));
          commit("update_image_url", user);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Update Profile
  updateProfile({ commit }, profile) {
    let uid = profile.id;
    return new Promise((resolve, reject) => {
      delete profile.id;
      httpClient({
        url: `${API_URL}/v1/users/${uid}`,
        data: profile,
        method: "PATCH",
      })
        .then((resp) => {
          const user = resp.data;
          localStorage.setItem("user", JSON.stringify(user));
          commit("update_profile_success", user);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

const mutations = {
  login_success(state, token, user) {
    state.status = "success";
    state.token = token;
    state.user = user;
  },
  register_success(state, user) {
    state.status = "success";
    state.user = user;
  },
  change_password_success(state, user) {
    state.status = "success";
    state.user = user;
  },
  verify_success(state) {
    state.status = "success";
  },
  verify_company_success(state) {
    state.status = "success";
  },
  verify_email_success(state, data) {
    state.status = "success";
    state.temp_data = data;
  },
  update_profile_success(state, user) {
    state.status = "success";
    state.user = user;
  },
  token_update_success(state, token) {
    state.status = "success";
    state.token = token;
  },
  auth_logout(state) {
    state.status = "Logging out...";
    state.user = "";
    state.token = "";
  },
  update_image_url(state, user) {
    state.status = "success";
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
