import axios from "axios";

const API_URL = process.env.VUE_APP_VENDOR_URL
  ? process.env.VUE_APP_VENDOR_URL
  : "http://127.0.0.1:8000";

const state = {
  vendor: "",
  vendors: "",
  vendor_image_data: "",
  current_vendor: "",
  current_vendor_id: "",
};

const getters = {
  vendorList: (state) => state.vendors,
  vendorSpecific: (state) => state.vendor,
  vendorData: (state) => state.current_vendor,
  vendorID: (state) => state.current_vendor_id,
  vendorImage: (state) => state.vendor_image_data,
};

const actions = {
  // Vendor Data
  getVendor({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/vendors/${id}`,
        method: "GET",
      })
        .then((resp) => {
          const vendor = resp.data;
          commit("get_vendor_sucess", vendor);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Vendor List
  getVendors({ commit }) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/vendors`,
        method: "GET",
      })
        .then((resp) => {
          const vendors = resp.data;
          commit("get_vendors_sucess", vendors);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Add Vendor
  addVendor({ commit }, vendor_data) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/vendors`,
        data: vendor_data,
        method: "POST",
      })
        .then((resp) => {
          const vendor_data = resp.data;
          commit("add_vendor_sucess", vendor_data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Add Vendor Image
  uploadVendorImage({ commit }, file) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/vendors/upload`,
        data: file,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((resp) => {
          const vendor_image_data = resp.data;
          commit("add_image_sucess", vendor_image_data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Update Vendor
  updateVendor({ commit }, vendor_data) {
    let id = vendor_data._id;
    return new Promise((resolve, reject) => {
      delete vendor_data._id;
      axios({
        url: `${API_URL}/v1/vendors/${id}`,
        data: vendor_data,
        method: "PUT",
      })
        .then((resp) => {
          const vendor_data = resp.data;
          commit("update_vendor_sucess", vendor_data);
          this.dispatch("getVendors", { flat: "false" });
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // Delete Vendor
  deleteVendor({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios({
        url: `${API_URL}/v1/vendors/${data.vendor_id}`,
        method: "DELETE",
      })
        .then(() => {
          commit("delete_vendor_success");
          this.dispatch("getVendors");
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

const mutations = {
  add_vendor_sucess(state, vendor) {
    state.status = "success";
    state.current_vendor = vendor;
  },
  add_image_sucess(state, image_data) {
    state.status = "success";
    state.vendor_image_data = image_data;
  },
  update_vendor_sucess(state, vendor) {
    state.status = "success";
    state.current_vendor = vendor;
  },
  set_current_vendor(state, id) {
    state.status = "success";
    localStorage.setItem("current_vendor_id", id);
    state.current_vendor_id = id;
  },
  reset_current_vendor(state) {
    state.status = "success";
    state.current_vendor_id = "";
  },
  reset_vendor_image(state) {
    state.status = "success";
    state.vendor_image_data = "";
  },
  get_vendor_sucess(state, vendor) {
    state.status = "success";
    state.vendor = vendor;
  },
  get_vendors_sucess(state, vendors) {
    state.status = "success";
    state.vendors = vendors;
  },
  delete_vendor_success(state) {
    state.status = "success";
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
