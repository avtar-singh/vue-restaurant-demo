const state = {
  user: JSON.parse(localStorage.getItem("user")) || "",
};

const getters = {
  userData: (state) => state.user,
  isAuthenticated: (state) => !!state.user,
  authStatus: (state) => state.status,
  user: (state) => state.user,
};

const actions = {
  // Login
  login({ commit }, user) {
    let data = user;
    console.log(data);
    return new Promise(() => {
      const user = data;
      localStorage.setItem("user", JSON.stringify(user)); // Set User Object
      commit("login_success", user);
    });
  },
  logout({ commit }) {
    return new Promise((resolve) => {
      commit("auth_logout");
      localStorage.removeItem("user"); // Clear User Object
      resolve();
    });
  },
};

const mutations = {
  login_success(state, user) {
    state.status = "success";
    state.user = user;
  },
  auth_logout(state) {
    state.status = "Logging out...";
    state.user = "";
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
