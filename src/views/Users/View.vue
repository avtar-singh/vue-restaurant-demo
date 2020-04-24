<template>
  <div>
    <base-header type="gradient-success" class="pb-4 pt-4"> </base-header>
    <div class="container-fluid mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-7">
          <div class="card shadow border-0">
            <div class="card-body px-lg-5 pt-lg-5 pb-lg-3">
              <div v-if="user">
                  <div class="form-group has-label">
                    <label class="form-control-label">
                      Name
                    </label>
                    <div class="form-control form-control-alternative">
                      {{ user.name }}
                    </div>
                  </div>
                  <div class="form-group has-label">
                    <label class="form-control-label">
                      Email Address
                    </label>
                    <div class="form-control form-control-alternative">
                      {{ user.email }}
                    </div>
                  </div>
                  <div class="form-group has-label">
                    <label class="form-control-label">
                      Device Token
                    </label>
                    <div class="form-control form-control-alternative">
                      {{ user.device_token }}
                    </div>
                  </div>
                  <div class="form-group has-label">
                    <label class="form-control-label">
                      Date of Birth
                    </label>
                    <div class="form-control form-control-alternative">
                      {{ parseDate(user.d_o_b) }}
                    </div>
                  </div>
                  <div class="form-group has-label">
                    <label class="form-control-label">
                      City
                    </label>
                    <div class="form-control form-control-alternative">
                      {{ user.city }}
                    </div>
                  </div>
                  <div class="form-group has-label">
                    <label class="form-control-label">
                      State
                    </label>
                    <div class="form-control form-control-alternative">
                      {{ user.state }}
                    </div>
                  </div>
                  <div class="form-group has-label">
                    <label class="form-control-label">
                      Country
                    </label>
                    <div class="form-control form-control-alternative">
                      {{ user.country }}
                    </div>
                  </div>
                  <div class="form-group has-label">
                    <label class="form-control-label">
                      Status
                    </label>
                    <div class="form-control form-control-alternative">
                      <badge class="badge-dot mr-4" :type="user.status == 'active' ? 'success' : 'danger'">
                        <i :class="`bg-${user.status == 'active' ? 'success' : 'danger'}`"></i>
                        <span class="status">{{ user.status }}</span>
                      </badge>
                    </div>
                  </div>
                  <div class="text-right">
                    <base-button type="primary" class="my-4" v-if="user.status == 'active'" @click.prevent="handleBlock(user)">Block</base-button>
                    <base-button type="primary" class="my-4" v-if="user.status == 'blocked'" @click.prevent="handleUnblock(user)">Unblock</base-button>
                    <base-button type="primary" class="my-4" @click.prevent="handleDelete(user)">Delete</base-button>
                  </div>
              </div>
              <div v-else>
                <h3>Processing...</h3>
              </div>
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
  name: "view",
  data() {
    return {
      type: "light"
    };
  },
  methods: {
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
              this.$store.dispatch("getUser", this.$route.params.id);
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
              this.$store.dispatch("getUser", this.$route.params.id);
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
              this.$router.push("/users");
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
  },
  beforeMount() {
    // Progress Bar - Start
    this.$Progress.start();
    this.$store.dispatch("getUser", this.$route.params.id);
  },
  mounted() {
    // Progress Bar - Finish
    this.$Progress.finish();
  },
  computed: {
    user() {
      return this.$store.getters.currentUser;
    }
  }
};
</script>
