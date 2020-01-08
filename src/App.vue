<template>
  <v-app>
    <Sounds />
    <HeaderNav />
    <v-content>
      <router-view class="empty-top-for-spacer" />
    </v-content>
  </v-app>
</template>

<script>
import HeaderNav from "./components/HeaderNav.vue";
import Sounds from "./components/Sounds.vue";

export default {
  name: "App",
  components: {
    HeaderNav,
    Sounds
  },
  data: () => ({})
};
</script>

<style scoped>
.empty-top-for-spacer {
  padding-top: 64px;
}
</style>