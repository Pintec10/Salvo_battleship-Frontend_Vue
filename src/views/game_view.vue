<template>
  <div class="background">
    <div class="game-view-container">
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
                  :updatingFleet="updatingFleet"
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

          <!--  Area with state info and general game info -->
          <div class="d-flex flex-column justify-center align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn small fab :color="stateInfo.color" class="my-2" v-on="on" :ripple="false">
                  <v-icon dark small color="white" v-on="on">{{stateInfo.icon}}</v-icon>
                </v-btn>
              </template>
              <span>{{stateInfo.message}}</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  dark
                  color="blue-grey lighten-4"
                  class="my-2"
                  @click="overlay = !overlay"
                >
                  <v-icon large color="indigo">mdi-information-variant</v-icon>
                </v-btn>

                <v-overlay :value="overlay" opacity="0.8">
                  <div class="pa-8">
                    <v-btn icon large @click="overlay = false" color="red">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <p>
                      Arrange your boats by dragging them on your game grid. You can rotate a ship by
                      pushing the
                      <v-btn
                        fab
                        dark
                        color="deep-orange accent-3"
                        height="4vmin"
                        width="4vmin"
                        class="rotate-button mx-1"
                      >
                        <v-icon class="rotate-icon" size="3vmin">mdi-rotate-3d-variant</v-icon>
                      </v-btn>rotation button. You must wait for your opponent to place their ships too before you can start firing salvoes.
                    </p>
                    <p>
                      You can fire a salvo of
                      <span class="font-weight-bold">5 shots</span> each turn. Select/unselect a case by
                      clicking on your opponent's grid, then push the
                      <v-btn x-small dark color="red darken-2" class="mx-1">
                        <v-icon x-small class="mr-1">mdi-crosshairs-gps</v-icon>FIRE!
                      </v-btn>button. You will see immediately the result of your shots (e.g.
                      <v-chip dark x-small color="red" class="mx-1">3</v-chip>= successful hit on turn 3,
                      <v-chip dark x-small color="grey" class="mx-1">1</v-chip>= miss on turn 1),
                      but you must wait until your opponent has done the same before you can fire another salvo.
                    </p>
                    <p>
                      The
                      <span class="font-weight-bold">"Fleet status"</span> panel on the left shows the damage suffered by your boats, and if
                      they have been sunken. Your opponent's Fleet Status panel only shows which ships have been sunken.
                    </p>
                    <p>
                      When all of a player's ships are sunk, the game ends and the winner gets 1 point.
                      If both players' fleets get destroyed on the same round, a tie occurs and each gets 0.5 points.
                    </p>
                    <p>
                      <span class="font-weight-bold">TIP:</span> Hover on the small icon in the center of the screen,
                      just above the "Information" button, to know if you are ready to submit a salvo or
                      need to wait for your opponent.
                    </p>
                  </div>
                </v-overlay>
              </template>
              <span>Click for game rules</span>
            </v-tooltip>
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
                  :dark="salvoPlacementList.length === 5 && gamedata.setupComplete"
                  v-if="!placingShips && !gamedata.gameOver"
                  :disabled="salvoPlacementList.length !== 5 || !firingSalvoes || !gamedata.setupComplete"
                  color="red darken-2"
                  class="mt-5"
                  @click="postPlacedSalvoes(salvoPlacementList)"
                >
                  <div v-if="!firingSalvoes || !gamedata.setupComplete">
                    <v-icon class="mr-1">mdi-timer-sand</v-icon>Waiting...
                  </div>
                  <div v-else>
                    <v-icon class="mr-1">mdi-crosshairs-gps</v-icon>FIRE!
                  </div>
                </v-btn>
              </div>
              <div class="ml-5">
                <Fleet
                  :isViewersFleet="false"
                  :fleetData="gamedata.ships"
                  :viewerGPid="this.$route.params.gpId"
                  :battleStatus="gamedata.battleStatus"
                  :fleetStatus="selectFleetStatus(false)"
                  :updatingFleet="updatingFleet"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- BOTTOM SHEET TO SHOW THAT GAME IS OVER -->
        <div class="text-center">
          <v-bottom-sheet v-model="bottomSheet">
            <v-sheet class="text-center" height="200px" color="hsla(0, 50%, 0%, 0.7)">
              <v-icon dark x-large :color="stateInfo.color" class="my-4">{{stateInfo.icon}}</v-icon>

              <div class="my-3">{{stateInfo.message}}</div>
              <v-btn class="mt-6" dark color="red" @click="sheet = !sheet">close</v-btn>
            </v-sheet>
          </v-bottom-sheet>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import GameGrid from "@/components/GameGrid.vue";
import { mapGetters, mapMutations } from "vuex";
import Fleet from "@/components/Fleet.vue";
//const proxi = "https://infinite-shore-25867.herokuapp.com"; //RESTORE FOR LIVE BUILD
const proxi = "";

export default {
  name: "game_view",
  components: {
    GameGrid,
    Fleet
  },

  data() {
    return {
      loaded: false,
      dataUpdater: null,
      gamedata: {},
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      placingShips: false,
      firingSalvoes: false,
      updatingFleet: false,
      overlay: false,
      sheet: true,
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
        gamePlayer: 0,
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
      fetch(
        proxi + "/api/games/players/" + this.$route.params.gpId + "/ships",
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shipList)
        }
      )
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
            this.updateSalvoPlacementList("reset");
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
      fetch(proxi + "/api/game_view/" + this.$route.params.gpId, {
        credentials: "include"
      })
        .then(response => response.json())
        .then(json => {
          this.updatingFleet = true;
          this.gamedata = json;
          if (this.gamedata.ships.length === 0) {
            this.gamedata.ships = [...this.defaultShipList];
            this.placingShips = true;
          } else {
            this.updateFiringSalvoesStatus();
          }
          //if setupComplete true, update placingSalvoes
          if (this.gamedata.ships.length !== 0) {
            this.updateFiringSalvoesStatus();
          }
          this.shipSort();
          this.loaded = true;
        });
    },

    postPlacedSalvoes(targetLocationsList) {
      document.getElementById("launch").play();
      let responseState = "";
      let salvo = {};
      salvo.locations = targetLocationsList;
      fetch(
        proxi + "/api/games/players/" + this.$route.params.gpId + "/salvoes",
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(salvo)
        }
      )
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
            this.firingSalvoes = false;
            this.updateSalvoPlacementList("reset");
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
          selectedReport = { ...oneReport };
        }
      });

      if (selectedReport === null) {
        selectedReport = this.defaultStatusReport;
      }

      let fleet = selectedReport.fleetStatus;
      if (fleet.length > 1) {
        for (let i = 0; i < fleet.length - 1; i++) {
          for (let j = i + 1; j < fleet.length; j++) {
            if (
              fleet[i].maxHP <= fleet[j].maxHP ||
              (fleet[i].maxHP === fleet[j].maxHP &&
                fleet[i].type === "Submarine")
            ) {
              let temp = { ...fleet[i] };
              fleet[i] = { ...fleet[j] };
              fleet[j] = { ...temp };
            }
          }
        }
      }
      this.updatingFleet = false;
      return selectedReport.fleetStatus;
    },

    updateFiringSalvoesStatus() {
      if (!this.gamedata.setupComplete) {
        this.firingSalvoes = false;
      } else {
        this.firingSalvoes = !this.gamedata.salvoes.some(
          oneSalvo =>
            oneSalvo.turn == this.gamedata.currentTurn &&
            oneSalvo.gamePlayer == this.$route.params.gpId
        );
      }
    }
  },

  computed: {
    ...mapGetters(["alertPopup", "shipPlacementList", "salvoPlacementList"]),

    stateInfo() {
      let output = {};
      output.color = "amber";
      output.icon = "mdi-timer-sand";
      output.message = "Waiting for your opponent...";
      if (this.gamedata.gameOver) {
        if (this.gamedata.opponentVictory && this.gamedata.viewerVictory) {
          output.icon = "mdi-emoticon-neutral";
          output.color = "amber";
          output.message = "It's a tie!";
        } else if (this.gamedata.viewerVictory) {
          output.icon = "mdi-trophy-award";
          output.color = "green";
          output.message = "You won!";
        } else if (this.gamedata.opponentVictory) {
          output.icon = "mdi-skull";
          output.color = "red";
          output.message = "You lost...";
        }
      } else if (this.placingShips) {
        output.icon = "mdi-ferry";
        output.color = "indigo";
        output.message =
          "Arrange your ships by dragging and rotating them, then push 'Ready to go!'";
      } else if (this.firingSalvoes) {
        output.icon = "mdi-crosshairs-gps";
        output.color = "green";
        output.message =
          "Click on the opponent's grid to place your shots, then push 'Fire!'";
      }

      return output;
    },

    bottomSheet() {
      return this.gamedata.gameOver && this.sheet;
    }
  },

  created() {
    this.getGameData();
    this.updateShipPlacementList([]);
    this.updateSalvoPlacementList("reset");

    this.dataUpdater = setInterval(() => {
      if (!this.placingShips) {
        this.getGameData();
      }
      if (this.gamedata.gameOver) {
        clearInterval(this.dataUpdater);
      }
    }, 8000);
  },

  beforeDestroy() {
    clearInterval(this.dataUpdater);
  }
};
</script>

<style scoped>
.absolute {
  position: absolute;
}

.background {
  background-image: url("../assets/background_03.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  height: 100%;
}

.game-view-container {
  background-color: hsla(0, 50%, 0%, 0.7);
  height: 100%;
}

.test {
  border: 1px solid red;
}
</style>