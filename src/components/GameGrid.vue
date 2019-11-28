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
import { mapMutations } from "vuex";

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
    ...mapMutations(["alertPopupOn", "alertPopupOff"]),

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
      console.log("initializing handleDrop");
      console.log("arrival cell:" + arrivalCell.row, +" " + arrivalCell.col);
      let newShip = this.generateShip(arrivalCell, shipData);
      let shipArray = this.gamedata.ships;

      //initializing variables for illegal ship placement
      let conflict = false;
      let errorMessage = ";";

      newShip.location.forEach(examinedCell => {
        //checking if overlapping with existing ship
        console.log("checking for overlap");
        shipArray.forEach(oneExistingShip => {
          if (
            oneExistingShip.id !== newShip.id &&
            oneExistingShip.location.some(existingCell => {
              return existingCell === examinedCell;
            })
          ) {
            conflict = true;
            errorMessage = "Overlapping with existing ship!";
          }
        });

        //checking if trying to place boat out of grid
        console.log("checking for out of grid placement");
        //let examinedCellRow = examinedCell[0];
        let examinedCellCol = examinedCell.substring(1);
        const isInsideGrid = this.columns.some(existingCol => {
          return existingCol == examinedCellCol;
        });

        if (isInsideGrid === false) {
          conflict = true;
          errorMessage = " Trying to place the boat out of the grid!";
        }
      });

      //if all ok, adding the ship to the list and dropping it down
      if (conflict === false) {
        console.log("checks passed, pushing and appending");

        //removing same ship from array if already present
        console.log("checking if already present");
        shipArray.forEach((oneExistingShip, index) => {
          if (oneExistingShip.id === newShip.id) {
            console.log("removed ship from array! " + oneExistingShip.type);
            shipArray.splice(index, 1);
          }
        });

        shipArray.push(newShip);
        nativeEvent.target.appendChild(document.getElementById(shipData.id));
      } else {
        console.log("checks not passed!");
        this.alertPopupOn({ type: "error", message: errorMessage });
        setTimeout(() => {
          this.alertPopupOff();
        }, 2000);
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