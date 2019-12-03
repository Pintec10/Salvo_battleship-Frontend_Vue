<template>
  <div>
    <p>Fleet</p>
    <v-row class="d-flex flex-column fleet-container justify-space-between">
      <Drop class="my-1" @dragenter="rotateShip">
        <v-btn>
          <v-icon>mdi-rotate-3d-variant</v-icon>
        </v-btn>
      </Drop>

      <div v-for="(ship, i) in fleetSpec" :key="i">
        <Drag
          class="shipwrapper d-flex"
          :id="ship.id"
          :transfer-data="ship"
          :draggable="placingShips"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
        >
          <div v-for="(cell, c) in ship.size" :key="c" class="gridcell" drop-effect="move">
            <v-img :src="getImageUrl(ship.size, c)" />
          </div>
          <div
            slot="image"
            class="shipwrapper"
            :class="{'d-flex': draggedShip.orientation === 'horizontal'}"
          >
            <div v-for="(cell, c) in draggedShip.size" :key="c" class="gridcell">
              <!-- <v-img :src="getImageUrl(ship.size, c)" /> -->
              <!-- <v-img src="../assets/ship-hor-start.png" /> -->
            </div>
          </div>
        </Drag>
      </div>
    </v-row>
  </div>
</template>

<script>
import { Drag, Drop } from "vue-drag-drop";
export default {
  name: "fleet",
  components: { Drag, Drop },

  props: {
    placingShips: {
      type: Boolean
    }
  },

  data() {
    return {
      test: false, //LATER REMOVE
      fleetSpec: [
        {
          id: "ship1",
          type: "Aircraft Carrier",
          size: 5,
          placed: false,
          orientation: "horizontal"
        },
        {
          id: "ship2",
          type: "Battleship",
          size: 4,
          placed: false,
          orientation: "vertical"
        },
        {
          id: "ship3",
          type: "Submarine",
          size: 3,
          placed: false,
          orientation: "horizontal"
        },
        {
          id: "ship4",
          type: "Destroyer",
          size: 3,
          placed: false,
          orientation: "horizontal"
        },
        {
          id: "ship5",
          type: "Patrol Boat",
          size: 2,
          placed: false,
          orientation: "horizontal"
        }
      ],
      dragging: false,
      draggedShip: {
        id: "",
        type: "",
        size: 0,
        placed: false,
        orientation: "horizontal"
      }
    };
  },

  methods: {
    handleDragStart(transferData) {
      this.draggedShip = transferData;
      setTimeout(() => {
        document.getElementById(transferData.id).style.zIndex = "-1";
      }, 0);
    },
    handleDragEnd(transferData) {
      document.getElementById(transferData.id).style.zIndex = "0";
      this.dragging = false;
    },

    rotateShip() {
      console.log(this.draggedShip.orientation + ", rotating...");
      if (this.draggedShip.orientation === "horizontal") {
        this.draggedShip.orientation = "vertical";
      } else {
        this.draggedShip.orientation = "horizontal";
      }
      console.log(this.draggedShip.orientation);
    },

    getImageUrl(shipSize, cell) {
      if (cell === 0) {
        return require("../assets/ship-hor-start.png");
      } else if (cell === shipSize - 1) {
        return require("../assets/ship-hor-end.png");
      } else {
        return require("../assets/ship-hor-body.png");
      }
    }
  }
};
</script>

<style scoped>
.fleet-container {
  height: 50vh;
}

.shipwrapper {
  border: 0.1px solid hsla(0, 50%, 0%, 0.5);
  z-index: 1;
  background-color: hsla(0, 50%, 100%, 0.5);
}

.gridcell {
  width: 5.5vmin;
  height: 5.5vmin;
  background-size: cover;
  box-sizing: border-box;
}

.greenborder {
  border: 1px solid green;
}
</style>