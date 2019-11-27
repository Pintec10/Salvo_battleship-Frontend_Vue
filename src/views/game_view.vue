<template>
  <v-container>
    <h1 class="text-center">Ship map</h1>
    <v-btn dark @click="postPlacedShips(shipList)">SEND SHIPS</v-btn>

    <!-- Popup for alerts -->
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

    <!-- Grids -->
    <div v-if="loaded" class="d-flex justify-space-around">
      <div class="d-flex flex-column align-center">
        <h2>You: {{playerInfo(true, "name")}}</h2>
        <GameGrid
          :gamedata="gamedata"
          :rows="rows"
          :columns="columns"
          :isViewersGrid="true"
          :firingGamePlayerID="playerInfo(false, 'GPID')"
        />
      </div>
      <div class="d-flex flex-column align-center">
        <h2>Your opponent: {{playerInfo(false, "name")}}</h2>
        <GameGrid
          :gamedata="gamedata"
          :rows="rows"
          :columns="columns"
          :isViewersGrid="false"
          :firingGamePlayerID="playerInfo(true, 'GPID')"
        />
      </div>
    </div>

    <!-- dragdroptest -->
    <div class="my-3">
      <p>dragdrop area</p>
      <drag class="dragtest ma-1 pa-3" :transfer-data="test">dragger</drag>
      <drop class="dragtest ma-1 pa-3" @drop="handleDrop">dropper</drop>
    </div>
  </v-container>
</template>

<script>
import GameGrid from "@/components/GameGrid.vue";
import { mapGetters, mapMutations } from "vuex";
import { Drag, Drop } from "vue-drag-drop";

export default {
  name: "game_view",
  components: {
    GameGrid,
    Drag,
    Drop
  },

  data() {
    return {
      loaded: false,
      gamedata: {},
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      shipList: [
        { type: "Destroyer", locations: ["A1", "A2", "A3"] },
        { type: "Patrol Boat", locations: ["I10", "J10"] }
      ]
    };
  },

  methods: {
    ...mapMutations(["alertPopupOn", "alertPopupOff"]),

    shipSort() {
      this.gamedata.ships.forEach(item => item.location.sort());
    },

    playerInfo(isViewer, requestedInfo) {
      let outputInfo = "?";
      this.gamedata.gameplayers.forEach(gameplayer => {
        if (
          //for the present player
          isViewer === true &&
          gameplayer.id.toString() === this.$route.params.gpId.toString()
        ) {
          if (requestedInfo === "name") {
            outputInfo = gameplayer.player.username;
          }
          if (requestedInfo === "GPID") {
            outputInfo = gameplayer.id;
          }
        } else if (
          //for the opponent
          isViewer === false &&
          gameplayer.id.toString() !== this.$route.params.gpId.toString()
        ) {
          if (requestedInfo === "name") {
            outputInfo = gameplayer.player.username;
          }
          if (requestedInfo === "GPID") {
            outputInfo = gameplayer.id;
          }
        }
      });
      return outputInfo;
    },

    postPlacedShips(shipList) {
      let responseState = "";
      fetch("/api/games/players/" + this.$route.params.gpId + "/ships", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipList)
      })
        .then(response => {
          if (response.status >= 300) {
            responseState = "error";
          }
          return response.text();
        })
        .then(respMessage => {
          if (responseState === "error") {
            return Promise.reject(new Error(respMessage));
          } else {
            this.loaded = false;
            this.getGameData();
          }
        })
        .catch(error => {
          //alert(error);
          this.alertPopupOn({
            type: "error",
            message: error
          });
          //context.commit("alertPopupOn", {
          //  type: "error",
          //  message: data.error
          //});
          setTimeout(() => {
            this.alertPopupOff();
            //context.commit("alertPopupOff");
          }, 6000);
        });
    },

    getGameData() {
      fetch("/api/game_view/" + this.$route.params.gpId)
        .then(response => response.json())
        .then(json => {
          this.gamedata = json;
          this.shipSort();
          this.loaded = true;
        });
    },

    handleDrop(data) {
      alert("transferred:" + data);
    }
  },

  computed: {
    ...mapGetters(["alertPopup"]),

    test() {
      return "CIAO";
    }
  },

  created() {
    this.getGameData();
  }
};
</script>

<style scoped>
/* TESTING FOR DRAGDROP */
.dragtest {
  width: 5.5vmin;
  height: 5.5vmin;
  background-color: green;
}
</style>