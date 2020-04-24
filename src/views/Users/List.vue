<template>
  <div>
    <base-header type="gradient-success" class="pb-4 pt-4">
    </base-header>
    <div class="container-fluid">
      <div class="card-shadow">
        <div class="table-responsive" v-if="userList">
          <base-table
            class="table align-items-center table-flush"
            :thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
            tbody-classes="list"
            :data="userList"
          >
            <template slot="columns">
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Device Token</th>
              <th>Date of Birth</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th></th>
            </template>

            <template slot-scope="{ row }">
              <th scope="row">
                <div class="media align-items-center">
                  <a href="#" class="avatar avatar-sm rounded-circle mr-3">
                    <img :src="row.image" />
                  </a>
                  <div class="media-body">
                    <span class="name mb-0 text-sm">{{ row.name }}</span>
                  </div>
                </div>
              </th>
              <td>
                {{ row.email }}
              </td>
              <td>
                <badge class="badge-dot mr-4" :type="row.status == 'active' ? 'success' : 'danger'">
                  <i :class="`bg-${row.status == 'active' ? 'success' : 'danger'}`"></i>
                  <span class="status">{{ row.status }}</span>
                </badge>
              </td>
             <td>
                {{ row.device_token }}
              </td>

              <td>
                {{ parseDate(row.d_o_b) }}
              </td>

              <td>
                {{ row.city }}
              </td>
              <td>
                {{ row.state }}
              </td>
              <td>
                {{ row.country }}
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
                    <a class="cs dropdown-item" @click.prevent="handleView(row)">View</a>
                    <a class="cs dropdown-item" v-if="row.status == 'active'" @click.prevent="handleBlock(row)">Block</a>
                    <a class="cs dropdown-item" v-if="row.status == 'blocked'" @click.prevent="handleUnblock(row)">Unblock</a>
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
      </div>
    </div>
  </div>
</template>
<script>
import swal from "sweetalert2";
export default {
  name: "Users",
  data() {
    return {
      type: "light"
    };
  },
  methods: {
    handleView(user) {
      this.$router.push(`/users/${user.id}`);
    },
    handleBlock(user) {
      swal.fire({
        text: "Are you sure to block this user?",
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
            .dispatch("updateUser", {
              _id: user.id,
              status: 'blocked'
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
    handleUnblock(user) {
      swal.fire({
        text: "Are you sure to unblock this user?",
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
            .dispatch("updateUser", {
              _id: user.id,
              status: 'active'
            })
            .then(() => {
              this.$store.dispatch("getUsers");
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
    // Delete User
    handleDelete(user) {
      swal.fire({
        text: "Are you sure to delete this user?",
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
          // Dispatch Delete User API
          this.$store.dispatch("deleteUser", {
            user_id: user.id
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
          this.deleteRow(user);
        }
      });
    },
    // Delete Specific User
    deleteRow(user) {
      let indexToDelete = this.userList.findIndex(
        tableRow => tableRow._id === user._id
      );
      if (indexToDelete >= 0) {
        this.userList.splice(indexToDelete, 1);
      }
    },
  },
  beforeMount() {
    // Progress Bar - Start
    this.$Progress.start();
    this.$store.dispatch("getUsers");
  },
  mounted() {
    // Progress Bar - Finish
    this.$Progress.finish();
  },
  computed: {
    userList() {
      return this.$store.getters.userList;
    }
  },
};
</script>
<style scoped>
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
