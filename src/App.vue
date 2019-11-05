<template>
  <v-app>
    <v-app-bar app>
      <!--<v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>-->
      <router-link to="/">Home</router-link>|
      <router-link to="/game_view/1">Game view 1</router-link>|
      <router-link to="/leaderboard">Leaderboard</router-link>|
    </v-app-bar>

    <v-content>
      <!--<HelloWorld />-->
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
//import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    //HelloWorld
  },
  data: () => ({
    //
  })
};
</script>
