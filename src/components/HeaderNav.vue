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
      <v-btn class="mx-1" to="/" icon>
        <v-icon>mdi-home-flood</v-icon>
      </v-btn>
      <v-btn class="mx-1" to="/game_view/1" icon :disabled="!logged">
        <v-icon>mdi-ferry</v-icon>
      </v-btn>
      <v-btn to="/leaderboard" icon>
        <v-icon>mdi-trophy</v-icon>
      </v-btn>

      <v-btn v-if="logged === false" class="mx-1" to="/login" icon>
        <v-icon>mdi-account-key</v-icon>
      </v-btn>
      <v-btn v-else @click="logout" icon>
        <v-icon>mdi-exit-run</v-icon>
      </v-btn>
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