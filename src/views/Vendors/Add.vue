<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pt-4"> </base-header>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card shadow border-0">
            <div class="card-body px-lg-5 pt-lg-5 pb-lg-3">
              <form role="form">
                <base-input placeholder="Name" v-model="vendor.name"></base-input>
                <base-input ref="image" @change="onFileChange" type="file" v-model="image"></base-input>
                <base-input placeholder="Location" v-model="vendor.location"></base-input>
                <base-input placeholder="Category" v-model="vendor.category"></base-input>
                <base-input placeholder="mPesa Pay Bill" v-model="vendor.mpesaPayBill"></base-input>
                <base-input placeholder="mPesa Payout Method" v-model="vendor.mpesaPayoutMethod"></base-input>
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
      vendor: {
        name: "",
        image: "",
        category: "",
        location: "",
        mpesaPayBill: "",
        mpesaPayoutMethod: ""
      }
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
    create() {
      this.$Progress.start();
      if (this.vendorImage) {
        this.vendor.image = this.vendorImage.secure_url;
      }
      this.$store
        .dispatch("addVendor", this.vendor)
        .then(() => {
            swal.fire({
              text: `Vendor created successfully`,
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
  computed: {
    vendorImage() {
      return this.$store.getters.vendorImage || {};
    }
  }
};
</script>
