import axios from "axios";

const API_URL = process.env.VUE_APP_AUTH_URL
  ? process.env.VUE_APP_AUTH_URL
  : "http://127.0.0.1:8000";

const state = {
  restaurant: "",
  restaurants: "",
  restaurant_image_data: "",
  current_restaurant: "",
  current_restaurant_id: "",
};

const getters = {
  restaurantList: (state) => state.restaurants,
  restaurantSpecific: (state) => state.restaurant,
  restaurantData: (state) => state.current_restaurant,
  restaurantID: (state) => state.current_restaurant_id,
  restaurantImage: (state) => state.restaurant_image_data,
};

const actions = {
  // Restaurant Data
  getRestaurant({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/restaurants/${id}`,
        method: "GET",
      })
        .then((resp) => {
          const restaurant = resp.data;
          commit("get_restaurant_sucess", restaurant);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Restaurant List
  getRestaurants({ commit }) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/restaurants`,
        method: "GET",
      })
        .then((resp) => {
          const restaurants = resp.data;
          commit("get_restaurants_sucess", restaurants);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Add Restaurant
  addRestaurant({ commit }, restaurant_data) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/restaurants`,
        data: restaurant_data,
        method: "POST",
      })
        .then((resp) => {
          const restaurant_data = resp.data;
          commit("add_restaurant_sucess", restaurant_data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Add Restaurant Image
  uploadRestaurantImage({ commit }, file) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/restaurants/uploadImage`,
        data: file,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((resp) => {
          const restaurant_image_data = resp.data;
          commit("add_image_sucess", restaurant_image_data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Update Restaurant
  updateRestaurant({ commit }, restaurant_data) {
    let id = restaurant_data._id;
    return new Promise((resolve, reject) => {
      delete restaurant_data._id;
      axios({
        url: `${API_URL}/v1/restaurants/${id}`,
        data: restaurant_data,
        method: "PUT",
      })
        .then((resp) => {
          const restaurant_data = resp.data;
          commit("update_restaurant_sucess", restaurant_data);
          this.dispatch("getRestaurants");
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Delete Restaurant
  deleteRestaurant({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/restaurants/${data.restaurant_id}`,
        method: "DELETE",
      })
        .then(() => {
          commit("delete_restaurant_success");
          this.dispatch("getRestaurants");
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

const mutations = {
  add_restaurant_sucess(state, restaurant) {
    state.status = "success";
    state.current_restaurant = restaurant;
  },
  add_image_sucess(state, image_data) {
    state.status = "success";
    state.restaurant_image_data = image_data;
  },
  update_restaurant_sucess(state, restaurant) {
    state.status = "success";
    state.current_restaurant = restaurant;
  },
  set_current_restaurant(state, id) {
    state.status = "success";
    localStorage.setItem("current_restaurant_id", id);
    state.current_restaurant_id = id;
  },
  reset_current_restaurant(state) {
    state.status = "success";
    state.current_restaurant_id = "";
  },
  reset_restaurant_image(state) {
    state.status = "success";
    state.restaurant_image_data = "";
  },
  get_restaurant_sucess(state, restaurant) {
    state.status = "success";
    state.restaurant = restaurant;
  },
  get_restaurants_sucess(state, restaurants) {
    state.status = "success";
    state.restaurants = restaurants;
  },
  delete_restaurant_success(state) {
    state.status = "success";
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
