<template>
  <v-container>
    <h1 class="text-center">Games Dashboard</h1>
    <div class="my-3" v-if="loaded === true">
      <v-data-table
        :headers="headers"
        :items="sourcedata['games_info']"
        :loading="!loaded"
        sort-by="total_score"
        :sort-desc="true"
        :search="search"
      >
        <template v-slot:top>
          <v-row class="mx-1">
            <v-btn class="my-2 ml-2 mr-12" color="blue" dark @click="createNewGame">Create New game</v-btn>
            <v-btn
              outlined
              class="ma-2"
              color="red"
              dark
              v-if="logged === true"
              @click="searchValue(sourcedata['current_user'].name)"
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
            <!--<v-btn class="ma-2" color="black" outlined @click="searchValue('')">Reset</v-btn>-->
          </v-row>
        </template>
        <template v-slot:item.action="{item}">
          <!-- WILL ADD CONDITIONS FOR ENDED GAMES!! -->
          <v-btn icon v-if="!userParticipates(item) && logged && !gameIsFull(item)">
            <v-icon>mdi-feather</v-icon>
          </v-btn>
          <v-btn
            icon
            v-if="userParticipates(item) && logged"
            @click="continueGame(item.gameplayers)"
          >
            <v-icon>mdi-play-pause</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
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
          text: "Player 1",
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
      console.log("creating new game...");
      fetch("/api/games", {
        credentials: "include",
        method: "POST"
      })
        .then(response => response.json())
        .then(json => {
          console.log("received this");
          console.log(json);
          this.$router.push("/game_view/" + json.gpid);
        })
        .catch(error => {
          alert("New game could not be created. ", error);
        });
    }
  },

  computed: {
    ...mapGetters(["logged"])
  },

  created() {
    fetch("/api/games")
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

<style>
</style>