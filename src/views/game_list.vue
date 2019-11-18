<template>
  <v-container>
    <h1 class="text-center">Games List</h1>
    <div class="my-3" v-if="loaded === true">
      <v-data-table
        :headers="headers"
        :items="sourcedata['games_info']"
        :loading="!loaded"
        sort-by="total_score"
        :sort-desc="true"
      >
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
      console.log("continuing game...");
      gameplayers.forEach(gameplayer => {
        console.log("checking gp" + gameplayer.id);
        if (gameplayer.player.id === this.sourcedata.current_user.id) {
          console.log("match!");
          this.$router.push("/game_view/" + gameplayer.id);
        }
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
            minutes = d.getMinutes();
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