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
        <div
          class="gridcell bordered d-flex justify-center align-center"
          :class="[cellContent(i, j)]"
        >
          <v-chip
            v-if="getSalvoTurn(i, j, firingGamePlayerID) !== 0"
            color="red"
            dark
            x-small
          >{{getSalvoTurn(i, j, firingGamePlayerID)}}</v-chip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "game_grid",
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
    return {};
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
    }
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