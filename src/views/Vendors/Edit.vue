<template>
  <div>
    <base-header type="gradient-success" class="pb-4 pt-4"> </base-header>
    <div class="container-fluid mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card shadow border-0">
            <div class="card-body px-lg-5 pt-lg-5 pb-lg-3">
              <form role="form" v-if="vendor">
                <base-input placeholder="Name" v-model="vendor.name"></base-input>
                <base-input ref="image" @change="onFileChange" type="file" v-model="image"></base-input>
                <base-input placeholder="Address" v-model="vendor.address"></base-input>
                <base-input placeholder="Location" v-model="vendor.location"></base-input>
                <base-input placeholder="Category" v-model="vendor.category"></base-input>
                <base-input placeholder="mPesa Pay Bill" v-model="vendor.mpesaPayBill"></base-input>
                <base-input placeholder="mPesa Payout Method" v-model="vendor.mpesaPayoutMethod"></base-input>
                <div class="text-right">
                  <base-button type="primary" class="my-4" @click.prevent="update">Update</base-button>
                </div>
              </form>
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
  name: "Edit",
  data() {
    return {
      type: "light"
    };
  },
  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      var formData = new FormData();
      formData.append("file", files[0]);
      this.$store.dispatch("uploadVendorImage", formData);
    },
    update() {
      this.$Progress.start();
      if (this.vendorImage) {
        this.vendor.image = this.vendorImage.secure_url;
      }
      delete this.vendor['__v'];
      delete this.vendor['createdAt'];
      delete this.vendor['updatedAt'];
      this.$store
        .dispatch("updateVendor", this.vendor)
        .then(() => {
            swal.fire({
              text: `Vendor updated successfully`,
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            });
            this.$router.push("/vendors");
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
  beforeMount() {
    // Progress Bar - Start
    this.$Progress.start();
    this.$store.dispatch("getVendor", this.$route.params.id);
  },
  mounted() {
    // Progress Bar - Finish
    this.$Progress.finish();
  },
  computed: {
    vendorImage() {
      return this.$store.getters.vendorImage || {};
    },
    vendor() {
      return this.$store.getters.vendorSpecific;
    }
  }
};
</script>
