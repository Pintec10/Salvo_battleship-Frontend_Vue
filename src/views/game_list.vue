<template>
  <div class="background">
    <v-container>
      <h1 class="text-center my-3 black--text">Games Dashboard</h1>
      <div class="my-3" v-if="loaded === true">
        <v-data-table
          class="table-main pa-3"
          :headers="headers"
          :items="onlyActiveGames"
          :loading="!loaded"
          sort-by="total_score"
          :sort-desc="true"
          :search="search"
        >
          <template v-slot:top>
            <v-row class="mx-1">
              <v-btn
                :outlined="!yourGamesFilterIsOn"
                class="ma-2"
                color="red lighten-1"
                dark
                v-if="logged"
                @click="OnlyUserFilter(sourcedata['current_user'].name)"
              >
                <v-icon small class="mr-1">mdi-crosshairs</v-icon>Your games
              </v-btn>
              <v-text-field
                v-model="search"
                class="ml-1 mr-3"
                prepend-icon="mdi-magnify"
                label="Search"
                clearable
              ></v-text-field>
              <v-btn
                :disabled="!logged"
                class="my-2 ml-8 mr-2"
                color="blue"
                :dark="logged"
                @click="createNewGame"
              >Create New game</v-btn>
            </v-row>
          </template>
          <template v-slot:item.action="{item}">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-if="!userParticipates(item) && logged && !gameIsFull(item)"
                  v-on="on"
                  @click="joinExistingGame(item.id)"
                >
                  <v-icon>mdi-feather</v-icon>
                </v-btn>
              </template>
              <span>Join game</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-if="userParticipates(item) && logged"
                  @click="continueGame(item.gameplayers)"
                  v-on="on"
                >
                  <v-icon>mdi-play-pause</v-icon>
                </v-btn>
              </template>
              <span>Continue game</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const proxi = "https://infinite-shore-25867.herokuapp.com";

export default {
  name: "game_list",

  data() {
    return {
      loaded: false,
      sourcedata: {},
      search: "",
      headers: [
        {
          text: "Match #",
          value: "id",
          align: "center"
        },
        {
          text: "Player 1",
          value: "gameplayers[0].player.username",
          align: "center"
        },
        {
          text: "Player 2",
          value: "gameplayers[1].player.username",
          align: "center"
        },
        {
          text: "Created on",
          value: "created",
          align: "center"
        },
        {
          text: "Actions",
          value: "action",
          align: "center"
        }
      ]
    };
  },

  methods: {
    OnlyUserFilter(user) {
      if (this.search === this.sourcedata["current_user"].name) {
        this.search = "";
      } else this.searchValue(user);
    },

    searchValue(value) {
      this.search = value;
    },

    userParticipates(oneGame) {
      let gameplayers = oneGame.gameplayers,
        currentPlayerId = this.sourcedata["current_user"].id;
      return gameplayers.some(oneGP => {
        return oneGP.player.id === currentPlayerId;
      });
    },

    gameIsFull(oneGame) {
      return oneGame.gameplayers.length > 1;
    },

    continueGame(gameplayers) {
      gameplayers.forEach(gameplayer => {
        if (gameplayer.player.id === this.sourcedata.current_user.id) {
          this.$router.push("/game_view/" + gameplayer.id);
        }
      });
    },

    createNewGame() {
      fetch(proxi + "/api/games", {
        credentials: "include",
        method: "POST"
      })
        .then(response => response.json())
        .then(json => {
          this.$router.push("/game_view/" + json.gpid);
        })
        .catch(error => {
          alert("New game could not be created. ", error);
        });
    },

    joinExistingGame(gameID) {
      fetch(proxi + "/api/game/" + gameID + "/players", {
        credentials: "include",
        method: "POST"
      })
        .then(response => response.json())
        .then(json => {
          this.$router.push("/game_view/" + json.gpid);
        })
        .catch(error => {
          alert("Could not join game. ", error);
        });
    }
  },

  computed: {
    ...mapGetters(["logged"]),

    onlyActiveGames() {
      return this.sourcedata["games_info"].filter(
        oneGame => oneGame.gameplayers[0].score === null
      );
    },

    yourGamesFilterIsOn() {
      return this.search === this.sourcedata["current_user"].name;
    }
  },

  created() {
    fetch(proxi + "/api/games", { credentials: "include" })
      .then(response => response.json())
      .then(json => {
        this.sourcedata = json;
        this.sourcedata["games_info"].forEach(element => {
          let d = Date.parse(element.created);
          d = new Date(d);
          let year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            hour = d.getHours(),
            minutes = d
              .getMinutes()
              .toLocaleString(undefined, { minimumIntegerDigits: 2 });
          element.created =
            " " + day + "/" + month + "/" + year + ", " + hour + ":" + minutes;
        });
        this.loaded = true;
      });
  }
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

.table-main {
  background-color: hsla(0, 50%, 0%, 0.8);
}
</style>