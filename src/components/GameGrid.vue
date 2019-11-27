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
        <Drop
          @drop="handleDrop({row: row, col: column}, ...arguments)"
          class="gridcell cellborder d-flex align-center water"
        >
          <v-img
            v-if="cellContent(i,j) !== 'water' && placingShips === false"
            :src="getImageUrl(cellContent(i,j))"
          />
          <!-- <div
            v-if="cellContent(i,j) !== 'water'"
            :style="{ backgroundImage: getImageUrl(cellContent(i,j))}"
          ></div>-->

          <v-chip
            v-if="getSalvoTurn(i, j, firingGamePlayerID) !== 0"
            color="red"
            dark
            x-small
            class="absolute"
          >{{getSalvoTurn(i, j, firingGamePlayerID)}}</v-chip>
        </Drop>
      </div>
    </div>
    <!-- <div class="my-3">
      <p>testing drop area</p>
      <drop class="dragtest ma-1 pa-5" @drop="handleDrop">dropper</drop>
    </div>-->
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
    },
    placingShips: {
      type: Boolean
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

    getImageUrl(filename) {
      return require("../assets/" + filename + ".png");
    },

    getSalvoTurn(row, col, firingGamePlayerID) {
      let examinedCase = this.cellname(row, col);
      let firingTurn = 0;
      this.gamedata.salvoes.forEach(oneSalvo => {
        if (
          oneSalvo.locations.some(hitcase => hitcase === examinedCase) &&
          oneSalvo.gamePlayer === firingGamePlayerID
        ) {
          firingTurn = oneSalvo.turn;
        }
      });
      return firingTurn;
    },

    handleDrop(arrivalCell, shipData, nativeEvent) {
      //alert(
      //  "dropping " + shipData.type + " at " + arrivalCell.row + arrivalCell.col
      //);

      let newShip = this.generateShip(arrivalCell, shipData);
      let shipArray = this.gamedata.ships;
      //removing same ship from array if already present
      shipArray.forEach((oneShip, index) => {
        if (oneShip.id === newShip.id) {
          shipArray.splice(index, 1);
        }
      });

      let conflict = false;
      let errorMessage = ";";

      //checking if overlapping with existing ship
      newShip.location.forEach(examinedCell => {
        shipArray.forEach(oneShip => {
          if (
            oneShip.location.some(existingCell => {
              return existingCell === examinedCell;
            })
          ) {
            conflict = true;
            errorMessage = "Overlapping with existing ship!";
          }
        });

        //let examinedCellRow = examinedCell[0];
        let examinedCellCol = examinedCell.substring(1);
        const outness = this.columns.some(existingCol => {
          existingCol === examinedCellCol.toString();
        });
        console.log(examinedCellCol);
        console.log(this.columns);
        console.log(outness);

        //if (
        //  this.columns.some(existingCol => {
        //    existingCol === examinedCellCol;
        //  })
        //) {
        //  conflict = true;
        //  errorMessage = " Trying to place the boat out of the grid!";
        //}
      });

      //if all ok, adding the ship to the list and dropping it down
      if (conflict === false) {
        shipArray.push(newShip);
        nativeEvent.target.appendChild(document.getElementById(shipData.id));
      } else {
        alert(errorMessage);
      }
    },

    generateShip(arrivalCell, shipData) {
      let newShip = {};
      newShip.id = shipData.id;
      newShip.type = shipData.type;
      newShip.location = [];
      for (let n = 0; n < shipData.size; n++) {
        let cell = "";
        if (shipData.orientation === "horizontal") {
          cell += arrivalCell.row + (+arrivalCell.col + n);
        }
        newShip.location.push(cell);
      }
      console.log(newShip);
      return newShip;
    }
  }
};
</script>

<style scoped>
.gridcell {
  width: 5vmin;
  height: 5vmin;
  background-size: cover;
  box-sizing: border-box;
}

.cellborder {
  box-shadow: 0px 0px 1.5px 0.5px hsla(0, 50%, 100%, 0.6) inset;
  /*outline: 1px dotted white;*/
}

/*.gridrow .gridcolumn:nth-child(2) .cellborder {
  border-left: 1px solid grey;
}

.gridrow .gridcolumn:last-child .cellborder {
  border-right: 1px solid grey;
}

.grid .gridrow:nth-child(2) .cellborder {
  border-top: 1px solid grey;
}

.grid .gridrow:last-child .cellborder {
  border-bottom: 1px solid grey;
}*/

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