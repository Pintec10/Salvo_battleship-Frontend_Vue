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
          <Drag
            v-if="cellContent(i,j).isShipStart"
            :id="cellContent(i,j).shipType"
            class="d-flex align-self-start shipwrapper"
            :class="{'flex-column': !cellContent(i,j).isHorizontal}"
            :transfer-data="cellContent(i,j)"
            :draggable="placingShips"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
          >
            <div
              v-for="(cell, c) in cellContent(i,j).shipLength"
              :key="c"
              class="gridcell"
              :class="{'flex-column': !cellContent(i,j).isHorizontal}"
              drop-effect="move"
            >
              <v-img
                :src="getImageUrl(c, cellContent(i,j).shipLength, cellContent(i,j).isHorizontal)"
              />
            </div>
            <div
              slot="image"
              class="shipwrapper d-flex"
              :class="{'flex-column': !cellContent(i,j).isHorizontal}"
            >
              <div v-for="(cell, c) in cellContent(i,j).shipLength" :key="c" class="gridcell">
                <v-img
                  :src="getImageUrl(c, cellContent(i,j).shipLength, cellContent(i,j).isHorizontal)"
                />
                <!-- check why is image not displaying or displays only on first drag!! -->
              </div>
            </div>

            <v-btn
              v-if="placingShips"
              fab
              dark
              color="deep-orange accent-3"
              height="4vmin"
              width="4vmin"
              class="rotate-button"
              @click="rotateShip(row, column, cellContent(i,j))"
            >
              <v-icon class="rotate-icon" size="3vmin">mdi-rotate-3d-variant</v-icon>
            </v-btn>

            <!-- <div slot="image" class="shipwrapper" :class="{'flex-column': !ship.horizontal }">
                  <div v-for="(cell, c) in draggedShip.size" :key="c" class="gridcell">
                    <v-img src="../assets/ship-hor-start.png" />
                  </div>
            </div>-->
          </Drag>

          <v-chip
            v-if="getSalvoTurn(i, j, firingGamePlayerID) !== 0"
            color="red"
            dark
            x-small
            class="absolute on-top"
          >{{getSalvoTurn(i, j, firingGamePlayerID)}}</v-chip>
          <!--clickable div to submit Salvo-->
          <div
            v-else-if="firingSalvoes"
            @click="updateSalvoPlacementList(cellname(i, j))"
            class="gridcell d-flex justify-center align-center"
          >
            <v-icon v-if="onSalvoPlacementList(cellname(i, j))" color="black">mdi-bomb</v-icon>
          </div>
        </Drop>
      </div>
    </div>
  </div>
</template>

<script>
import { Drag, Drop } from "vue-drag-drop";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "game_grid",
  components: {
    Drag,
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
    },
    firingSalvoes: {
      type: Boolean
    },
    loaded: {
      type: Boolean
    }
  },
  data() {
    return {
      //dragOngoing: false
    };
  },

  methods: {
    ...mapMutations([
      "alertPopupOn",
      "alertPopupOff",
      "updateShipPlacementList",
      "updateSalvoPlacementList"
    ]),

    cellname(row, col) {
      return (this.rows[row] + this.columns[col]).toString();
    },

    cellContent(row, col) {
      let examinedCase = this.cellname(row, col);
      let output = {
        isShip: false,
        isHorizontal: false,
        isShipStart: false,
        shipLength: null,
        shipType: null
      };
      for (let ship in this.gamedata.ships) {
        let locationArray = this.gamedata.ships[ship].location;
        locationArray.forEach((locItem, locIndex) => {
          if (locItem === examinedCase && this.isViewersGrid === true) {
            //there is a ship
            output.isShip = true;
            output.shipType = this.gamedata.ships[ship].type;
            if (locationArray[0][0] === locationArray[1][0]) {
              //horizontal ship
              output.isHorizontal = true;
            }
            if (locItem === examinedCase && locIndex === 0) {
              output.isShipStart = true;
              output.shipLength = locationArray.length;
            }
          }
        });
      }
      return output;
    },

    getImageUrl(cellPosition, shipLength, shipIsHorizontal) {
      let outputUrl = "ship-";
      if (shipIsHorizontal) {
        outputUrl += "hor-";
      } else {
        outputUrl += "ver-";
      }
      switch (cellPosition) {
        case 0:
          outputUrl += "start"; //first ship tile
          break;
        case shipLength - 1:
          outputUrl += "end"; //last ship tile
          break;
        default:
          outputUrl += "body"; //middle ship tile
      }
      return require("../assets/" + outputUrl + ".png");
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

    handleDrop(arrivalCell, shipData) {
      let newShip = this.generateShip(arrivalCell, shipData);
      let shipArray = this.gamedata.ships;

      //initializing variables for illegal ship placement
      let conflict = false;
      let errorMessage = "";

      newShip.location.forEach(examinedCell => {
        //checking if overlapping with existing ship
        shipArray.forEach(oneExistingShip => {
          if (
            oneExistingShip.type !== newShip.type &&
            oneExistingShip.location.some(existingCell => {
              return existingCell === examinedCell;
            })
          ) {
            conflict = true;
            errorMessage = "Overlapping with existing ship!";
          }
        });

        //checking if trying to place boat out of grid
        let examinedCellRow = examinedCell[0];
        let examinedCellCol = examinedCell.substring(1);
        const isInsideGrid =
          this.columns.some(existingCol => {
            return existingCol == examinedCellCol;
          }) &&
          this.rows.some(existingRow => {
            return existingRow == examinedCellRow;
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
        shipArray.forEach((oneExistingShip, index) => {
          if (oneExistingShip.type === newShip.type) {
            shipArray.splice(index, 1);
          }
        });

        shipArray.push(newShip);
        this.updateShipPlacementList(shipArray);
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

      newShip.type = shipData.shipType;
      newShip.location = [];
      for (let n = 0; n < shipData.shipLength; n++) {
        let cell = "";
        if (shipData.isHorizontal === false) {
          cell += this.increaseRow(arrivalCell.row, n) + arrivalCell.col;
        } else {
          cell += arrivalCell.row + (+arrivalCell.col + n);
        }
        newShip.location.push(cell);
      }

      return newShip;
    },

    increaseRow(rowChar, increase) {
      return String.fromCharCode(rowChar.charCodeAt(0) + increase);
    },

    handleDragStart(transferData) {
      setTimeout(() => {
        document.getElementById(transferData.shipType).style.zIndex = "-1";
      }, 0);
    },

    rotateShip(row, column, shipData) {
      shipData.isHorizontal = !shipData.isHorizontal;
      this.handleDrop({ row: row, col: column }, shipData);
    },

    handleDragEnd(transferData) {
      document.getElementById(transferData.shipType).style.zIndex = "0";
    },

    onSalvoPlacementList(evaluatedCell) {
      return this.salvoPlacementList.some(
        alreadySelectedCell => alreadySelectedCell === evaluatedCell
      );
    }
  },

  computed: {
    ...mapGetters(["salvoPlacementList"])
  }
};
</script>

<style scoped>
.grid {
  user-select: none;
  /* necessary to fix a factory bug of the "draggable" prop of "Drag" elements*/
}

.gridcell {
  width: 5.5vmin;
  height: 5.5vmin;
  background-size: cover;
  box-sizing: border-box;
}

.cellborder {
  box-shadow: 0px 0px 1.5px 0.5px hsla(0, 50%, 100%, 0.6) inset;
  /*outline: 1px dotted white;*/
}

/* RESTORE THESE IF YOU WANT BORDER AROUND GRID 
.gridrow .gridcolumn:nth-child(2) .cellborder {
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
  background-image: url("../assets/giphy_water_1.gif");
  /* background-image: url("https://media.giphy.com/media/SHUu78CIqq4FO/giphy.gif"); */
  /*background-image: url("https://media.giphy.com/media/hqaaJowDvwv60/giphy.gif");*/
}

.shipwrapper {
  border: 0.1px solid hsla(0, 50%, 0%, 0.5);
  z-index: 1;
  background-color: hsla(0, 50%, 100%, 0.4);
  position: relative;
}

.absolute {
  position: absolute;
}

.on-top {
  z-index: 1;
}

.rotate-button {
  position: absolute;
  top: -1vmin;
  left: -1vmin;
  height: 3.5vmin;
  width: 3.5vmin;
}

.rotate-icon {
  height: 1vmin !important;
  width: 1vmin !important;
}

/*.highlightable :hover {
  border: 1px solid gold;
}*/

.test {
  border: 2px solid blue;
}
</style>