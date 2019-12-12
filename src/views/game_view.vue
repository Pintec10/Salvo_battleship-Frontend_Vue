<template>
  <v-container>
    <!-- Popup for alerts -->
    <div class="d-flex justify-center">
      <v-alert
        :value="alertPopup.visible"
        :color="alertPopup.type"
        dark
        :type="alertPopup.type"
        prominent
        dense
        dismissible
        transition="scale"
        class="absolute"
      >{{alertPopup.message}}</v-alert>
    </div>

    <div v-if="loaded" class="d-flex justify-space-around mt-3">
      <!-- Viewer's grid area -->
      <div class="d-flex flex-column align-center mr-5">
        <h2 class="mb-2">You: {{playerInfo(true, "name")}}</h2>

        <div class="d-flex justify-space-around">
          <div class="mr-5">
            <Fleet
              :isViewersFleet="true"
              :fleetData="gamedata.ships"
              :viewerGPid="$route.params.gpId"
              :battleStatus="gamedata.battleStatus"
              :fleetStatus="selectFleetStatus(true)"
            />
          </div>
          <div class="d-flex flex-column align-center">
            <GameGrid
              :gamedata="gamedata"
              :rows="rows"
              :columns="columns"
              :isViewersGrid="true"
              :firingGamePlayerID="playerInfo(false, 'GPID')"
              :placingShips="placingShips"
              :loaded="loaded"
              :firingSalvoes="false"
            />
            <v-btn
              :dark="shipPlacementList.length === 5"
              v-if="placingShips"
              :disabled="shipPlacementList.length !== 5"
              color="deep-orange accent-3"
              class="mt-5"
              @click="postPlacedShips(shipPlacementList)"
            >READY TO GO!</v-btn>
          </div>
        </div>
      </div>

      <!-- Opponent's grid area -->
      <div class="d-flex flex-column align-center ml-5">
        <h2 class="mb-2">Your opponent: {{playerInfo(false, "name")}}</h2>

        <div class="d-flex justify-space-between">
          <div class="d-flex flex-column align-center">
            <GameGrid
              :gamedata="gamedata"
              :rows="rows"
              :columns="columns"
              :isViewersGrid="false"
              :firingGamePlayerID="playerInfo(true, 'GPID')"
              :placingShips="false"
              :loaded="loaded"
              :firingSalvoes="firingSalvoes"
            />
            <v-btn
              :dark="salvoPlacementList.length === 5"
              v-if="firingSalvoes"
              :disabled="salvoPlacementList.length !== 5"
              color="red darken-2"
              class="mt-5"
              @click="postPlacedSalvoes(salvoPlacementList)"
            >
              <v-icon class="mr-1">mdi-crosshairs-gps</v-icon>FIRE!
            </v-btn>
          </div>
          <div class="ml-5">
            <Fleet
              :isViewersFleet="false"
              :fleetData="gamedata.ships"
              :viewerGPid="this.$route.params.gpId"
              :battleStatus="gamedata.battleStatus"
              :fleetStatus="selectFleetStatus(false)"
            />
          </div>
        </div>

        <audio id="target">
          <source src="../assets/sounds/bleep02.wav" />
        </audio>
        <audio id="cancel">
          <source src="../assets/sounds/cancel02.wav" />
        </audio>
        <audio id="launch">
          <source src="../assets/sounds/launch04.wav" />
        </audio>
      </div>
    </div>

    <!-- dragdroptest -->
    <!-- <div class="my-3">
      <p>dragdrop area</p>
      <drag id="dragbox" class="dragtest ma-1 pa-3" :transfer-data="test" drop-effect="move"></drag>
      <drop class="dragtest-2 ma-1 pa-1" @drop="handleDrop"></drop>
    </div>-->
  </v-container>
</template>

<script>
import GameGrid from "@/components/GameGrid.vue";
import { mapGetters, mapMutations } from "vuex";
//import { Drag, Drop } from "vue-drag-drop";
import Fleet from "@/components/Fleet.vue";

export default {
  name: "game_view",
  components: {
    GameGrid,
    Fleet
  },

  data() {
    return {
      loaded: false,
      gamedata: {},
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      placingShips: false,
      gameOn: false, //check in the end if it is actually needed!
      firingSalvoes: true, //later set to false
      defaultShipList: [
        {
          type: "Aircraft Carrier",
          location: ["A1", "A2", "A3", "A4", "A5"]
        },
        {
          type: "Battleship",
          location: ["C3", "C4", "C5", "C6"]
        },
        {
          type: "Submarine",
          location: ["E5", "E6", "E7"]
        },
        {
          type: "Destroyer",
          location: ["G7", "G8", "G9"]
        },
        {
          type: "Patrol Boat",
          location: ["I9", "I10"]
        }
      ],
      defaultStatusReport: {
        gamePlayer: 27,
        hitsReceived: null,
        missReceived: null,
        fleetStatus: []
      }
    };
  },

  methods: {
    ...mapMutations([
      "alertPopupOn",
      "alertPopupOff",
      "updateShipPlacementList",
      "updateSalvoPlacementList"
    ]),

    shipSort() {
      this.gamedata.ships.forEach(item =>
        item.location.sort(function(cell1, cell2) {
          let cell1Comp = cell1;
          let cell2Comp = cell2;
          if (cell1Comp.length === 2) {
            cell1Comp = cell1Comp[0] + "0" + cell1Comp[1];
          }
          if (cell2Comp.length === 2) {
            cell2Comp = cell2Comp[0] + "0" + cell2Comp[1];
          }
          return cell1Comp - cell2Comp;
        })
      );
    },

    playerInfo(isViewer, requestedInfo) {
      let outputInfo = "?";
      if (requestedInfo === "GPID") {
        outputInfo = 0;
      }
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
            this.placingShips = false;
            this.getGameData();
          }
        })
        .catch(error => {
          this.alertPopupOn({
            type: "error",
            message: error
          });
          setTimeout(() => {
            this.alertPopupOff();
          }, 6000);
        });
    },

    getGameData() {
      fetch("/api/game_view/" + this.$route.params.gpId)
        .then(response => response.json())
        .then(json => {
          this.gamedata = json;
          if (this.gamedata.ships.length === 0) {
            this.gamedata.ships = [...this.defaultShipList];
            this.placingShips = true;
          } else {
            this.updateSalvoPlacementList("reset");
            this.firingSalvoes = true;
          }
          this.shipSort();
          this.loaded = true;
        });
    },

    postPlacedSalvoes(targetLocationsList) {
      //document.getElementById("launch").play();
      let responseState = "";
      let salvo = {};
      salvo.locations = targetLocationsList;
      fetch("/api/games/players/" + this.$route.params.gpId + "/salvoes", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salvo)
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
            //document.getElementById("launch").play();
            this.loaded = false;
            this.firingSalvoes = false;
            this.getGameData();
          }
        })
        .catch(error => {
          this.alertPopupOn({
            type: "error",
            message: error
          });
          setTimeout(() => {
            this.alertPopupOff();
          }, 6000);
        });
    },

    selectFleetStatus(isViewersFleet) {
      let selectedReport = null;
      let viewersId = this.$route.params.gpId;

      this.gamedata.battleStatus.forEach(oneReport => {
        if (
          (isViewersFleet && oneReport.gamePlayer == viewersId) ||
          (!isViewersFleet && oneReport.gamePlayer != viewersId)
        ) {
          console.log("assign!" + oneReport.gamePlayer);
          selectedReport = Object.assign({}, oneReport);
        }
      });
      console.log(selectedReport);
      if (selectedReport === null) {
        selectedReport = this.defaultStatusReport;
      }

      return selectedReport.fleetStatus;
    }
  },

  computed: {
    ...mapGetters(["alertPopup", "shipPlacementList", "salvoPlacementList"])
  },

  created() {
    this.getGameData();
    this.updateShipPlacementList([]);
    this.updateSalvoPlacementList("reset");
  }
};
</script>

<style scoped>
/*.absolute {
  position: absolute;
}*/

.test {
  border: 1px solid red;
}
</style>