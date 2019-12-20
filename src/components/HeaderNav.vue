<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase">
      <span>SALVO!</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <span class="mr-2">Welcome,</span>
    <span v-if="loggedUser.id !== null" class="font-weight-bold blue--text">{{loggedUser.name}}</span>
    <span v-else class="font-weight-bold blue--text">Guest</span>.
    <div class="ml-3">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="mx-1" to="/" icon v-on="on">
            <v-icon>mdi-home-flood</v-icon>
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="mx-1" to="/game_list" icon v-on="on">
            <v-icon>mdi-ferry</v-icon>
          </v-btn>
        </template>
        <span>Games</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn to="/leaderboard" icon v-on="on">
            <v-icon>mdi-trophy</v-icon>
          </v-btn>
        </template>
        <span>Leaderboard</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="mx-1" to="/login" icon v-on="on" v-show="!logged">
            <v-icon>mdi-account-key</v-icon>
          </v-btn>
        </template>
        <span>Login</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{on}">
          <v-btn @click="logout" icon v-on="on" v-show="logged">
            <v-icon>mdi-exit-run</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
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
    ...mapActions(["logout", "fetchActiveUserContent"])
  },

  computed: {
    ...mapGetters(["loggedUser", "logged"])
  },

  created() {
    //this.fetchActiveUserContent();
  }
};
</script>

<style>
</style>