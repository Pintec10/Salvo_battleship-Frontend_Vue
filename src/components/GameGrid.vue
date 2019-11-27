<template>
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
        <div class="gridcell cellborder d-flex justify-center align-center water">
          <!--<v-img :src="'../src/assets/'+ cellContent(i,j) +'.jpg'" />-->
          <!--<v-img :src="'../assets/ship-hor-end.png'" />-->
          <v-img v-if="cellContent(i,j) !== 'water'" :src="getImageUrl(cellContent(i,j))" />
          <!--<p>{{test}}</p>-->
          <!--<p>{{cellContent(i,j)}}</p>-->
          <v-chip
            v-if="getSalvoTurn(i, j, firingGamePlayerID) !== 0"
            color="red"
            dark
            x-small
            class="absolute"
          >{{getSalvoTurn(i, j, firingGamePlayerID)}}</v-chip>
        </div>
      </div>
    </div>
    <div class="my-3">
      <p>testing drop area</p>
      <drop class="dragtest ma-1 pa-5" @drop="handleDrop">dropper</drop>
    </div>
  </div>
</template>

<script>
import { Drop } from "vue-drag-drop";

export default {
  name: "game_grid",
  components: {
    Drop
  },
  props: {
    gamedata: {
      type: Object
    },
    rows: {
      type: Array
    },
    columns: {
      type: Array
    },
    isViewersGrid: {
      type: Boolean
    },
    firingGamePlayerID: {
      type: Number
    }
  },
  data() {
    return {
      test: "../assets/ship-hor-end.png"
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
          if (locItem === examinedCase && this.isViewersGrid === true) {
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

    getImageUrl(filename) {
      return require("../assets/" + filename + ".png");
    },

    getSalvoTurn(row, col, firingGamePlayerID) {
      let examinedCase = this.cellname(row, col);
      let firingTurn = 0;
      this.gamedata.salvoes.forEach(oneSalvo => {
        if (
          oneSalvo.locations.some(hitcase => hitcase === examinedCase) &&
          //oneSalvo.player === firingGamePlayerID
          oneSalvo.gamePlayer === firingGamePlayerID
        ) {
          firingTurn = oneSalvo.turn;
        }
      });
      return firingTurn;
    },

    handleDrop(data) {
      alert("transferred in here:" + data);
    }
  }
};
</script>

<style scoped>
.gridcell {
  width: 5.5vmin;
  height: 5.5vmin;
  background-size: cover;
}

.grid .gridrow:not(:last-child) .cellborder {
  background-color: teal;
}

.cellborder {
  border-right: 0.5px dotted white;
  border-top: 0.5px dotted white;
}

.gridrow .gridcolumn:last-child .cellborder {
  border-right: 0.5px dotted white;
}

.grid .gridrow:last-child .cellborder {
  border-bottom: 0.5px dotted white;
}

.water {
  background-image: url("../assets/water.jpg");
  background-image: url("https://media.giphy.com/media/SHUu78CIqq4FO/giphy.gif");
  /*background-image: url("https://media.giphy.com/media/hqaaJowDvwv60/giphy.gif");*/
}

/*.ship-hor-start {
  background-image: url("../assets/ship-hor-start.png");
}
.ship-hor-body {
  background-image: url("../assets/ship-hor-body.png");
}
.ship-hor-end {
  background-image: url("../assets/ship-hor-end.png");
}
.ship-ver-start {
  background-image: url("../assets/ship-ver-start.png");
}
.ship-ver-body {
  background-image: url("../assets/ship-ver-bodypnpg");
}
.ship-ver-end {
  background-image: url("../assets/ship-ver-end.png");
}*/

.absolute {
  position: absolute;
}

.dragtest {
  width: 4vmin;
  height: 4vmin;
  background-color: blue;
}
</style>