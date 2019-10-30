<template>
  <v-container>
    <h1 class="text-center">Ship map</h1>
    <!--<p>gamedata: {{gamedata}}</p>
    <p>gameplayers: {{gamedata.gameplayers}}</p>-->
    <div class="d-flex justify-space-around">
      <div class="d-flex flex-column align-center">
        <h2>You: {{playerName(true)}}</h2>
        <div class="my-3 grid" v-if="loaded">
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
              <div class="gridcell bordered" :class="[cellContent(i, j)]"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column align-center">
        <h2>Your opponent: {{playerName(false)}}</h2>
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

    playerName(thisPlayer) {
      let name = "?";
      this.gamedata.gameplayers.forEach(gameplayer => {
        if (
          //for the present player
          thisPlayer === true &&
          gameplayer.id.toString() === this.$route.params.gpId.toString()
        ) {
          name = gameplayer.player.username;
        } else if (
          //for the opponent
          thisPlayer === false &&
          gameplayer.id.toString() !== this.$route.params.gpId.toString()
        ) {
          name = gameplayer.player.username;
        }
      });
      return name;
    }
  },

  computed: {},

  created() {
    fetch("/api/game_view/" + this.$route.params.gpId)
      .then(response => response.json())
      .then(json => {
        this.gamedata = json;
        this.shipSort();
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