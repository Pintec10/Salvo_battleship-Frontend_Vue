<template>
  <div class="background">
    <v-container class="d-flex justify-center">
      <v-card color="hsla(0, 50%, 0%, 0.7)" class="d-flex flex-column align-center pa-5">
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
            type="password"
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
            dense
            dismissible
            transition="scale"
          >{{alertPopup.message}}</v-alert>
        </div>
        <div class="my-3">
          <v-btn
            :loading="loadingLogin"
            class="mx-2 white--text"
            color="green"
            ripple
            :disabled="enteredValue.username === '' || enteredValue.password === ''"
            @click="login(enteredValue), loadingLogin = true"
          >Login</v-btn>
          <v-btn
            :loading="loadingRegister"
            class="mx-2 white--text"
            color="blue"
            ripple
            :disabled="enteredValue.username === '' || enteredValue.password === ''"
            @click="createUser(enteredValue), loadingRegister = true"
          >Register</v-btn>
        </div>
        <div class="my-3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :loading="loadingDemo"
                class="mx-2 white--text"
                color="blue-grey"
                ripple
                @click="login(demoCredentials), loadingDemo = true"
              >Login as demo player</v-btn>
            </template>
            <span>Log in with a mock account: allows you to check features available to registered users</span>
          </v-tooltip>
        </div>
      </v-card>
    </v-container>
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
      },
      demoCredentials: {
        username: "demoplayer@salvo",
        password: "demo"
      }
    };
  },

  methods: {
    ...mapActions(["login", "createUser"])
  },

  computed: {
    ...mapGetters([
      "loggedUser",
      "alertPopup",
      "loadingLogin",
      "loadingDemo",
      "loadingRegister"
    ])
  }
};
</script>

<style scoped>
.background {
  background-image: url("../assets/background_03.jpg");
  background-size: cover;
  background-position: center;
  height: 100%;
}
</style>