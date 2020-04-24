<template>
  <nav
    class="navbar"
    :class="[
      { 'navbar-expand-md': expand },
      { 'navbar-transparent': transparent },
      { [`bg-${type}`]: type },
    ]"
  >
    <div :class="containerClasses">
      <slot name="brand">
        <router-link
          :to="$route.path"
          class="h2 mb-0 text-white ml-md-2 d-inline-block active router-link-active"
        >
          {{ $route.name }}
        </router-link>
      </slot>
      <navbar-toggle-button
        v-if="showToggleButton"
        :toggled="toggled"
        :target="contentId"
        @click.native.stop="toggled = !toggled"
      >
        <span class="navbar-toggler-icon"></span>
      </navbar-toggle-button>

      <div
        class="collapse navbar-collapse"
        :class="{ show: toggled }"
        :id="contentId"
        v-click-outside="closeMenu"
      >
        <slot :close-menu="closeMenu"></slot>
      </div>
    </div>
    <div
      class="collapse navbar-collapse justify-content-end"
      id="navbarCollapse"
      style="width: 120px; height: 20px; cursor: pointer;"
      v-if="$route.path != '/login'"
    >
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" @click="logout">Sign Out</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import NavbarToggleButton from "./NavbarToggleButton";

export default {
  name: "base-nav",
  components: {
    NavbarToggleButton,
  },
  props: {
    type: {
      type: String,
      default: "",
      description: "Navbar type (e.g default, primary etc)",
    },
    title: {
      type: String,
      default: "",
      description: "Title of navbar",
    },
    contentId: {
      type: [String, Number],
      default: Math.random().toString(),
      description:
        "Explicit id for the menu. By default it's a generated random number",
    },
    containerClasses: {
      type: [String, Object, Array],
      default: "container-fluid",
    },
    transparent: {
      type: Boolean,
      default: false,
      description: "Whether navbar is transparent",
    },
    expand: {
      type: Boolean,
      default: false,
      description: "Whether navbar should contain `navbar-expand-lg` class",
    },
    showToggleButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      toggled: false,
    };
  },
  methods: {
    closeMenu() {
      this.toggled = false;
    },
    logout() {
      this.$Progress.start();
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.push('/login');
          this.$Progress.finish();
        });
    }
  },
};
</script>
<style scoped>
.h2 {
  line-height: 1rem;
}
</style>
