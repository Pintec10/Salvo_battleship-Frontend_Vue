<template>
  <div class="d-flex flex-column align-center my-5">
    <h1 class="mb-12">Login / Sign up</h1>
    <div>
      <v-text-field
        v-model="enteredValue.username"
        solo
        outlined
        label="email"
        placeholder="e.g. myname@gmail.com"
        hint="email address"
        persistent-hint
        class="my-3"
      />
      <v-text-field
        v-model="enteredValue.password"
        solo
        outlined
        label="email"
        placeholder="e.g. Passw0rd123$!"
        hint="password"
        persistent-hint
        class="my-3"
      />
    </div>
    <div>
      <v-alert
        :value="alertPopup.visible"
        :color="alertPopup.type"
        dark
        :type="alertPopup.type"
        prominent
        dense
        dismissible
        transition="scale"
      >{{alertPopup.message}}</v-alert>
    </div>
    <div class="my-3">
      <v-btn class="mx-3" color="green" @click="login(enteredValue)">Login</v-btn>
      <v-btn class="mx-3" color="blue" @click="createUser(enteredValue)">Register</v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "login",

  data() {
    return {
      enteredValue: {
        username: "",
        password: ""
      }
    };
  },

  methods: {
    ...mapActions(["login", "createUser"])
  },

  computed: {
    ...mapGetters(["loggedUser", "updateNavbar", "alertPopup"])
  }
};
</script>

<style>
</style>