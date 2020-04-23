<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pt-4">
    </base-header>
    <div class="container-fluid">
      <div class="card-shadow">
        <div class="table-responsive" v-if="vendorList">
          <base-table
            class="table align-items-center table-flush"
            :thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
            tbody-classes="list"
            :data="vendorList"
          >
            <template slot="columns">
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Category</th>
              <th>mPesa Pay Bill</th>
              <th>mPesa Payout Method</th>
              <th></th>
            </template>

            <template slot-scope="{ row }">
              <th scope="row">
                <div class="media align-items-center">
                  <a href="#" class="avatar avatar-sm rounded-circle mr-3">
                    <img alt="Image placeholder" :src="row.image" />
                  </a>
                  <div class="media-body">
                    <span class="name mb-0 text-sm">{{ row.name }}</span>
                  </div>
                </div>
              </th>
              <td>
                {{ row.location }}
              </td>
              <td>
                <badge class="badge-dot mr-4" :type="row.status == 'active' ? 'success' : 'danger'">
                  <i :class="`bg-${row.status == 'active' ? 'success' : 'danger'}`"></i>
                  <span class="status">{{ row.status }}</span>
                </badge>
              </td>
             <td>
                {{ row.category }}
              </td>

              <td>
                {{ row.mpesaPayBill }}
              </td>

              <td>
                {{ row.mpesaPayoutMethod }}
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
                    <a class="cs dropdown-item" @click.prevent="handleEdit(row)">Edit</a>
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
        <base-button id="add-vendor" title="Create New Vendor" type="primary" :iconOnly="true" icon="fa fa-plus" :rounded="true" @click.prevent="$router.push('/vendors/create')"></base-button>
      </div>
    </div>
  </div>
</template>
<script>
import swal from "sweetalert2";
export default {
  name: "Vendors",
  data() {
    return {
      type: "light"
    };
  },
  methods: {
    handleEdit(vendor) {
      this.$router.push(`/vendors/${vendor._id}`);
    },
    handleBlock(vendor) {
      swal.fire({
        text: "Are you sure to block this vendor?",
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
            .dispatch("updateVendor", {
              _id: vendor._id,
              status: 'blocked'
            })
            .then(() => {
              this.$store.dispatch("getVendors");
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
    handleUnblock(vendor) {
      swal.fire({
        text: "Are you sure to unblock this vendor?",
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
            .dispatch("updateVendor", {
              _id: vendor._id,
              status: 'active'
            })
            .then(() => {
              this.$store.dispatch("getVendors");
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
    // Delete Vendor
    handleDelete(vendor) {
      swal.fire({
        text: "Are you sure to delete this vendor?",
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
          // Dispatch Delete Vendor API
          this.$store.dispatch("deleteVendor", {
            vendor_id: vendor._id
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
          this.deleteRow(vendor);
        }
      });
    },
    // Delete Specific Vendor
    deleteRow(vendor) {
      let indexToDelete = this.vendorList.findIndex(
        tableRow => tableRow._id === vendor._id
      );
      if (indexToDelete >= 0) {
        this.vendorList.splice(indexToDelete, 1);
      }
    },
  },
  beforeMount() {
    // Progress Bar - Start
    this.$Progress.start();
    this.$store.dispatch("getVendors");
  },
  mounted() {
    // Progress Bar - Finish
    this.$Progress.finish();
  },
  computed: {
    vendorList() {
      return this.$store.getters.vendorList;
    }
  },
};
</script>
<style scoped>
#add-vendor {
  position: fixed;
  bottom: 35px;
  right: 35px;
  width: 60px;
  height: 60px;
}

#add-vendor i {
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
