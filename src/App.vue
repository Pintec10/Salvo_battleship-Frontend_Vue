<template>
  <v-app>
    <HeaderNav />
    <v-content>
      <router-view class="empty-top-for-spacer" />
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

<style scoped>
.empty-top-for-spacer {
  padding-top: 64px;
}
</style>