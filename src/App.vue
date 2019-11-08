<template>
  <v-app>
    <HeaderNav />
    <!--<v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>SALVO!</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="mr-2">Vuetify</span>
      <v-btn text href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank">
        <span class="mr-2">latest release</span>
      </v-btn>
      <router-link to="/">Home</router-link>|
      <router-link to="/game_view/1">Game view 1</router-link>|
      <router-link to="/leaderboard">Leaderboard</router-link>|
      <router-link to="/login">Login</router-link>|
    </v-app-bar>-->

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
