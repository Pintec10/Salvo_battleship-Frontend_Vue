<template>
  <div class="background">
    <div class="background d-flex justify-center align-center">
      <v-card
        class="text-center d-flex flex-column justify-space-between pa-5"
        color="hsla(0, 50%, 0%, 0.7)"
        min-width="50vw"
        min-height="50vh"
      >
        <h1>SALVO!</h1>
        <h3>Welcome aboard, Captain</h3>

        <div class="d-flex justify-space-bewtween align-self-center">
          <div class="d-flex flex-column justify-center align-center mx-5">
            <v-btn
              x-large
              color="indigo lighten-4"
              light
              class="mx-1 my-2"
              to="/game_list"
              fab
              v-on="on"
            >
              <v-icon>mdi-ferry</v-icon>
            </v-btn>
            <p>Dashboard</p>
          </div>
          <div class="d-flex flex-column justify-center align-center mx-5">
            <v-btn
              x-large
              color="indigo lighten-4"
              light
              class="mx-1 my-2"
              to="/leaderboard"
              fab
              v-on="on"
            >
              <v-icon>mdi-trophy</v-icon>
            </v-btn>
            <p>Leaderboard</p>
          </div>
          <div class="d-flex flex-column justify-center align-center mx-5">
            <v-btn
              x-large
              color="indigo lighten-4"
              light
              class="mx-1 my-2"
              to="/login"
              fab
              v-on="on"
            >
              <v-icon>mdi-account-key</v-icon>
            </v-btn>
            <p>Login</p>
          </div>
          <!-- <div class="d-flex flex-column">
            <v-btn to="/leaderboard" icon v-on="on">
              <v-icon>mdi-trophy</v-icon>
              <p>Leaderboard</p>
            </v-btn>
          </div>
          <div class="d-flex flex-column">
            <v-btn class="mx-1" to="/login" icon v-on="on" v-show="!logged">
              <v-icon>mdi-account-key</v-icon>
            </v-btn>
            <p>Login</p>
          </div>-->
        </div>
      </v-card>
    </div>>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  components: {},
  methods: {}
};
</script>

<style scoped>
.background {
  background-image: url("../assets/background_03.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  height: 100%;
}

.test {
  border: 1px solid red;
}
</style>
