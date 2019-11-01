<template>
  <v-container>
    <h1 class="text-center">Ship map</h1>
    <!--<p>gamedata: {{gamedata}}</p>
    <p>gameplayers: {{gamedata.gameplayers}}</p>-->
    <div v-if="loaded" class="d-flex justify-space-around">
      <div class="d-flex flex-column align-center">
        <h2>You: {{playerInfo(true, "name")}}</h2>
        <div class="my-3 grid">
          <!--first row -->
          <div class="d-flex">
            <div class="gridcell"></div>
            <div v-for="(column, j) in columns" :key="j" class="gridcell text-center">{{columns[j]}}</div>
          </div>
          <!-- grid rows, with row names -->
          <div v-for="(row, i) in rows" :key="i" class="d-flex gridrow">
            <div class="gridcell d-flex align-center justify-center">
              <div class="my-auto">{{rows[i]}}</div>
            </div>
            <div v-for="(column, j) in columns" :key="j" class="gridcolumn">
              <!-- ACTUAL GAME CELL DOWN HERE -->
              <div
                class="gridcell bordered d-flex justify-center align-center"
                :class="[cellContent(i, j)]"
              >
                <v-chip
                  v-if="getSalvoTurn(i, j, playerInfo(false, 'ID')) !== 0"
                  color="red"
                  dark
                  x-small
                >{{getSalvoTurn(i, j, playerInfo(false, 'ID'))}}</v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column align-center">
        <h2>Your opponent: {{playerInfo(false, "name")}}</h2>
        <div class="my-3 grid">
          <!--first row -->
          <div class="d-flex">
            <div class="gridcell"></div>
            <div v-for="(column, j) in columns" :key="j" class="gridcell text-center">{{columns[j]}}</div>
          </div>
          <!-- grid rows, with row names -->
          <div v-for="(row, i) in rows" :key="i" class="d-flex gridrow">
            <div class="gridcell d-flex align-center justify-center">
              <div class="my-auto">{{rows[i]}}</div>
            </div>
            <div v-for="(column, j) in columns" :key="j" class="gridcolumn">
              <!-- ACTUAL GAME CELL DOWN HERE -->
              <div class="gridcell bordered d-flex justify-center align-center" :class="'water'">
                <v-chip
                  v-if="getSalvoTurn(i, j, playerInfo(true, 'ID')) !== 0"
                  color="red"
                  dark
                  x-small
                >{{getSalvoTurn(i, j, playerInfo(true, 'ID'))}}</v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
//import stuff?
export default {
  name: "game_view",
  components: {},

  data() {
    return {
      loaded: false,
      gamedata: {},

      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    };
  },

  methods: {
    cellname(row, col) {
      return (this.rows[row] + this.columns[col]).toString();
    },

    cellContent(row, col) {
      let examinedCase = this.cellname(row, col);
      let output = "water";
      for (let ship in this.gamedata.ships) {
        let locationArray = this.gamedata.ships[ship].location;
        locationArray.forEach((locItem, locIndex) => {
          if (locItem === examinedCase) {
            //there is a ship
            output = "ship";
            if (locationArray[0][0] === locationArray[1][0]) {
              //horizontal ship
              output += "-hor";
            } else {
              //vertical ship
              output += "-ver";
            }
            switch (locIndex) {
              case 0:
                output += "-start"; //first ship tile
                break;
              case locationArray.length - 1:
                output += "-end"; //last ship tile
                break;
              default:
                output += "-body"; //middle ship tile
            }
          }
        });
      }
      return output;
    },

    shipSort() {
      console.log("sorting ships...");
      this.gamedata.ships.forEach(item => item.location.sort());
    },

    playerInfo(isViewer, requestedInfo) {
      let name = "?";
      this.gamedata.gameplayers.forEach(gameplayer => {
        if (
          //for the present player
          isViewer === true &&
          gameplayer.id.toString() === this.$route.params.gpId.toString()
        ) {
          if (requestedInfo === "name") {
            name = gameplayer.player.username;
          }
          if (requestedInfo === "ID") {
            name = gameplayer.player.id;
          }
        } else if (
          //for the opponent
          isViewer === false &&
          gameplayer.id.toString() !== this.$route.params.gpId.toString()
        ) {
          if (requestedInfo === "name") {
            name = gameplayer.player.username;
          }
          if (requestedInfo === "ID") {
            name = gameplayer.player.id;
          }
        }
      });
      return name;
    },

    getSalvoTurn(row, col, firingPlayerID) {
      let examinedCase = this.cellname(row, col);
      let firingTurn = 0;
      this.gamedata.salvoes.forEach(oneSalvo => {
        if (
          oneSalvo.locations.some(hitcase => hitcase === examinedCase) &&
          oneSalvo.player === firingPlayerID
        ) {
          console.log("MATCH!!!");
          firingTurn = oneSalvo.turn;
        }
      });
      console.log("Examined:" + examinedCase);
      console.log("firing turn:" + firingTurn);
      return firingTurn;
    }
  },

  computed: {},

  created() {
    fetch("/api/game_view/" + this.$route.params.gpId)
      .then(response => response.json())
      .then(json => {
        this.gamedata = json;
        this.shipSort();
        console.log(this.gamedata);
        this.loaded = true;
      });
  }
};
</script>

<style scoped>
.gridcell {
  width: 6vmin;
  height: 6vmin;
  background-size: cover;
}

/*.bordered {
  border-left: 1px solid black;
  border-top: 1px solid black;
}

.gridrow .gridcolumn:last-child .bordered {
  border-right: 1px solid black;
}

.grid .gridrow:last-child .bordered {
  border-bottom: 1px solid black;
}*/

.water {
  background-image: url("../assets/water.jpg");
  /*background-image: url("https://media.giphy.com/media/SHUu78CIqq4FO/giphy.gif");
  background-image: url("https://media.giphy.com/media/hqaaJowDvwv60/giphy.gif");*/
}

.ship-hor-start {
  background-image: url("../assets/ship-hor-start.jpg");
}
.ship-hor-body {
  background-image: url("../assets/ship-hor-body.jpg");
}
.ship-hor-end {
  background-image: url("../assets/ship-hor-end.jpg");
}
.ship-ver-start {
  background-image: url("../assets/ship-ver-start.jpg");
}
.ship-ver-body {
  background-image: url("../assets/ship-ver-body.jpg");
}
.ship-ver-end {
  background-image: url("../assets/ship-ver-end.jpg");
}
</style>