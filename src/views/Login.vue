<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-header bg-transparent pb-2">
          <div class="text-muted text-center mt-2 mb-3">
            <h2 class="h2">Sign In</h2>
          </div>
        </div>
        <div class="card-body px-lg-5 py-lg-5">
          <form role="form">
            <base-input
              class="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              v-model="email"
            >
            </base-input>

            <base-input
              class="input-group-alternative"
              placeholder="Password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="password"
            >
            </base-input>
            <div class="text-center">
              <base-button type="primary" class="my-4" @click.prevent="login">Submit</base-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import swal from "sweetalert2";

export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
      this.$Progress.start();
      // Dispatch Register API VueX
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password
        })
        .then(() => {
          // Check Token
          if (localStorage.getItem('access_token') != null) {
            // If Redirect URL
            if (this.$route.query.redirect != null) {
              this.$router.push(this.$route.query.redirect)
            } else {
              // If No Redirect URL
              const path = "/";
              if (this.$route.path !== path) this.$router.push(path)
            }
          }
          this.$Progress.finish();
        })
        .catch(err => {
          swal.fire({
            text: `${err.response.data.error.message}`,
            icon: "error",
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
          });
          this.$Progress.fail();
        });
    }
  }
};
</script>
<style></style>
