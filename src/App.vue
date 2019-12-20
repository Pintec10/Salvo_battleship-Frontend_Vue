<template>
  <v-app>
    <HeaderNav />

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import HeaderNav from "./components/HeaderNav.vue";

export default {
  name: "App",
  components: {
    HeaderNav
  },
  data: () => ({})
};
</script>
