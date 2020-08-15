<template>
  <div>
    <base-header type="gradient-success" class="pb-4 pt-4">
    </base-header>
    <div class="container-fluid">
      <div class="card-shadow">
        <div class="table-responsive" v-if="restaurantList">
          <base-table
            class="table align-items-center table-flush"
            :thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
            tbody-classes="list"
            :data="restaurantList"
          >
            <template slot="columns">
              <th>Name</th>
              <th>Location</th>
              <th>Created At</th>
              <th></th>
            </template>

            <template slot-scope="{ row }">
              <th scope="row">
                <div class="media align-items-center">
                  <a href="#" class="avatar avatar-sm rounded-circle mr-3">
                    <img v-if="row.image" alt="Image placeholder" :src="row.image" />
                    <img v-else alt="i" src="https://via.placeholder.com/150" />
                  </a>
                  <div class="media-body">
                    <span class="name mb-0 text-sm">{{ row.title }}</span>
                  </div>
                </div>
              </th>
              <td>
                {{ row.location }}
              </td>
              <td>
                {{ parseDate(row.created_at) }}
              </td>
              <td>
                <badge class="badge-dot mr-4" :type="row.status == 'enable' ? 'success' : 'danger'">
                  <i :class="`bg-${row.status == 'enable' ? 'success' : 'danger'}`"></i>
                  <span class="status">{{ row.status }}</span>
                </badge>
              </td>

              <td class="text-right">
                <base-dropdown class="dropdown" position="right">
                  <a
                    slot="title"
                    class="btn btn-sm btn-icon-only text-light"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </a>

                  <template>
                    <a class="cs dropdown-item" v-if="row.status == 'enable'" @click.prevent="handleBlock(row)">Block</a>
                    <a class="cs dropdown-item" v-if="row.status == 'disable'" @click.prevent="handleUnblock(row)">Unblock</a>
                    <a class="cs dropdown-item" @click.prevent="handleDelete(row)">Delete</a>
                  </template>
                </base-dropdown>
              </td>
            </template>
          </base-table>
        </div>
        <div class="mt-2" v-else>
          <h5>Processing...</h5>
        </div>
        <base-button id="add-restaurant" title="Create New Restaurant" type="primary" :iconOnly="true" icon="fa fa-plus" :rounded="true" @click.prevent="$router.push('/restaurants/create')"></base-button>
      </div>
    </div>
  </div>
</template>
<script>
import swal from "sweetalert2";
export default {
  name: "Restaurants",
  data() {
    return {
      type: "light"
    };
  },
  methods: {
    handleEdit(restaurant) {
      this.$router.push(`/restaurants/${restaurant._id}`);
    },
    handleBlock(restaurant) {
      swal.fire({
        text: "Are you sure to block this restaurant?",
        icon: "warning",
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-primary c-btn',
          cancelButton: 'btn btn-danger c-btn'
        },
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        buttonsStyling: false
      }).then(result => {
        // Progress Bar - Start
        this.$Progress.start();
        if (result.value) {
          this.$store
            .dispatch("updateRestaurant", {
              _id: restaurant._id,
              status: 'disable'
            })
            .then(() => {
              this.$Progress.finish();
            })
            .catch(err => {
              swal.fire({
                title: `${err.response.data.error.code}`,
                text: `${err.response.data.error.message}`,
                icon: "error",
                customClass: {
                  confirmButton: 'btn btn-danger'
                },
                buttonsStyling: false
              });
              this.$Progress.fail();
            });
        }
      });
    },
    handleUnblock(restaurant) {
      swal.fire({
        text: "Are you sure to unblock this restaurant?",
        icon: "warning",
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-primary c-btn',
          cancelButton: 'btn btn-danger c-btn'
        },
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        buttonsStyling: false
      }).then(result => {
        // Progress Bar - Start
        this.$Progress.start();
        if (result.value) {
          this.$store
            .dispatch("updateRestaurant", {
              _id: restaurant._id,
              status: 'enable'
            })
            .then(() => {
              this.$Progress.finish();
            })
            .catch(err => {
              swal.fire({
                title: `${err.response.data.error.code}`,
                text: `${err.response.data.error.message}`,
                icon: "error",
                customClass: {
                  confirmButton: 'btn btn-danger'
                },
                buttonsStyling: false
              });
              this.$Progress.fail();
            });
        }
      });
    },
    // Delete Restaurant
    handleDelete(restaurant) {
      swal.fire({
        text: "Are you sure to delete this restaurant?",
        icon: "warning",
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-primary c-btn',
          cancelButton: 'btn btn-danger c-btn'
        },
        confirmButtonText: "Yes",
        buttonsStyling: false
      }).then(result => {
        // If Delete
        if (result.value) {
          // Progress Bar - Start
          this.$Progress.start();
          // Dispatch Delete Restaurant API
          this.$store.dispatch("deleteRestaurant", {
            restaurant_id: restaurant._id
          })
            .then(() => {
              swal.fire({
                text: "Deleted successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
              this.$Progress.finish();
            })
            .catch(err => {
              swal.fire({
                title: `${err.response.data.error.code}`,
                text: `${err.response.data.error.message}`,
                icon: "error",
                customClass: {
                  confirmButton: 'btn btn-danger'
                },
                buttonsStyling: false
              });
              this.$Progress.fail();
            });
          this.deleteRow(restaurant);
        }
      });
    },
    // Delete Specific Restaurant
    deleteRow(restaurant) {
      let indexToDelete = this.restaurantList.findIndex(
        tableRow => tableRow._id === restaurant._id
      );
      if (indexToDelete >= 0) {
        this.restaurantList.splice(indexToDelete, 1);
      }
    },
  },
  beforeMount() {
    // Progress Bar - Start
    this.$Progress.start();
    this.$store.dispatch("getRestaurants");
  },
  mounted() {
    // Progress Bar - Finish
    this.$Progress.finish();
  },
  computed: {
    restaurantList() {
      return this.$store.getters.restaurantList;
    }
  },
};
</script>
<style scoped>
#add-restaurant {
  position: fixed;
  bottom: 35px;
  right: 35px;
  width: 60px;
  height: 60px;
}

#add-restaurant i {
  font-size: 1rem;
}

.table-responsive {
  min-height: 70vh;
}

.avatar {
  border: 2px solid #fff;
  width: 36px;
  height: 36px;
}
.avatar img {
  width: 36px;
  height: 36px;
  object-fit: cover;
}
.dropdown-item {
  cursor: pointer;
}
.cs.dropdown-item.active, .cs.dropdown-item:active {
    color: #fff;
}
</style>
