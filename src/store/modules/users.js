import { httpClient } from "@/services/http-client.js";

const API_URL = process.env.VUE_APP_AUTH_URL
  ? process.env.VUE_APP_AUTH_URL
  : "http://127.0.0.1:8000";

const state = {
  users: "",
  user: "",
  current_user: "",
};

const getters = {
  userList: (state) => state.users,
  currentUser: (state) => state.current_user,
};

const actions = {
  // User List
  getUsers({ commit }) {
    return new Promise((resolve, reject) => {
      httpClient({
        url: `${API_URL}/v1/users?role=user`,
        method: "GET",
      })
        .then((resp) => {
          const users = resp.data;
          commit("get_users_sucess", users);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // User Data
  getUser({ commit }, id) {
    return new Promise((resolve, reject) => {
      httpClient({
        url: `${API_URL}/v1/users/${id}`,
        method: "GET",
      })
        .then((resp) => {
          const user = resp.data;
          commit("get_user_sucess", user);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Update User
  updateUser({ commit }, user_data) {
    let id = user_data._id;
    return new Promise((resolve, reject) => {
      delete user_data._id;
      httpClient({
        url: `${API_URL}/v1/users/${id}`,
        data: user_data,
        method: "PATCH",
      })
        .then((resp) => {
          const user_data = resp.data;
          commit("update_user_sucess", user_data);
          this.dispatch("getUsers");
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Delete User
  deleteUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      httpClient({
        url: `${API_URL}/v1/users/${data.user_id}`,
        method: "DELETE",
      })
        .then(() => {
          commit("delete_user_success");
          this.dispatch("getUsers");
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

const mutations = {
  get_users_sucess(state, users) {
    state.status = "success";
    state.users = users;
  },
  get_user_sucess(state, user) {
    state.status = "success";
    state.current_user = user;
  },
  update_user_sucess(state, user) {
    state.status = "success";
    state.current_user = user;
  },
  delete_user_success(state) {
    state.status = "success";
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
