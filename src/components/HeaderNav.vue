<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase">
      <span>SALVO!</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <span class="mr-2">Welcome,</span>
    <span v-if="loggedUser.id !== null">{{loggedUser.name}}.</span>
    <span v-else>Guest.</span>
    <!--<v-btn text href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank">
      <span class="mr-2">Login</span>
    </v-btn>-->
    <div class="ml-3">
      <router-link class="mx-1" to="/">Home</router-link>
      <router-link class="mx-1" to="/game_view/1">Game view 1</router-link>
      <router-link class="mx-1" to="/leaderboard">Leaderboard</router-link>
      <router-link v-if="logged === false" class="mx-1" to="/login">Login</router-link>
      <v-btn v-else @click="logout">Logout</v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  name: "HeaderNav",
  data() {
    return {
      //data here
    };
  },
  methods: {
    ...mapActions(["logout"])
  },

  computed: {
    ...mapGetters(["loggedUser", "logged"])
  }
};
</script>

<style>
</style>