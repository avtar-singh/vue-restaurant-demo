<template>
  <div>
    <base-header type="gradient-success" class="pb-4 pt-4"> </base-header>
    <div class="container-fluid mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card shadow border-0">
            <div class="card-body px-lg-5 pt-lg-5 pb-lg-3">
              <form role="form">
                <base-input placeholder="Name" v-model="restaurant.title"></base-input>
                <base-input ref="image" @change="onFileChange" type="file" v-model="image"></base-input>
                <base-input placeholder="Location" v-model="restaurant.location"></base-input>
                <div class="single-menu" v-for="(menu, index) in restaurant.menus" :key="menu._id">
                  <label>Menu {{ index+1 }}</label>
                  <base-input placeholder="Title" v-model="menu.title"></base-input>
                  <div class="single-menu-item" v-for="(menu_item, index) in menu.sections" :key="menu_item._id">
                    <label>Menu Item {{ index+1 }}</label>
                    <base-input placeholder="Menu Item Name" v-model="menu_item.name"></base-input>
                    <base-input placeholder="Menu Item Price" v-model="menu_item.price"></base-input>
                  </div>
                  <base-button type="primary" class="add-menu mb-4" @click.prevent="addSection(menu._id)">Add Section</base-button>
                </div>
                <base-button type="primary" class="add-menu" @click.prevent="addMenu">Add Menu</base-button>
                <div class="text-right">
                  <base-button type="primary" class="my-4" @click.prevent="create">Create</base-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import swal from "sweetalert2";
export default {
  name: "Add",
  data() {
    return {
      type: "light",
      image: "",
      restaurant: {
        title: "",
        image: "",
        menus: [],
      }
    };
  },
  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      var formData = new FormData();
      formData.append("file", files[0]);
      this.$store.dispatch("uploadRestaurantImage", formData);
    },
    // Add New Menu
    addMenu() {
      let menu = {
        _id: Math.random().toString(36).substring(2),
        title: "",
        sections: []
      };
        this.restaurant.menus.push(menu);
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
    // Add Section 
    addSection(id) {
      let section = {
        _id: Math.random().toString(36).substring(2),
        name: "",
        price: ""
      };
      this.restaurant.menus.map(menu => {
       if (menu._id == id) {
         menu.sections.push(section);
       }
      });
    },
    create() {
      this.$Progress.start();
      if (this.restaurantImage) {
        this.restaurant.image = this.restaurantImage.secure_url;
      }
      this.restaurant.menus.map(menu => {
        delete menu._id;
        menu.sections.map(section => {
          delete section._id;
        });
      });
      this.$store
        .dispatch("addRestaurant", this.restaurant)
        .then(() => {
            swal.fire({
              text: `Restaurant created successfully`,
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            });
            this.$router.push("/restaurants");
            this.$Progress.finish();
          })
          .catch(err => {
            swal.fire({
              title: `${err.response.data.error.code}`,
              text: `${err.response.data.error.message}`,
              icon: "error",
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            });
            this.clear();
            this.$Progress.fail();
          });
    }
  },
  computed: {
    restaurantImage() {
      return this.$store.getters.restaurantImage || {};
    }
  }
};
</script>
