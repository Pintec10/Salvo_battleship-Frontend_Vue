<template>
  <div>
    <!-- <p>Fleet</p>
    <v-row class="d-flex flex-column fleet-container justify-space-between">
      <div v-for="(ship, i) in fleetSpec" :key="i">
        <Drag
          class="shipwrapper d-flex"
          :class="{'flex-column': !ship.horizontal}"
          :id="ship.id"
          :transfer-data="ship"
          :draggable="placingShips"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
        >
          <div v-for="(cell, c) in ship.size" :key="c" class="gridcell" drop-effect="move">
            <v-img :src="getImageUrl(ship.size, c)" />
          </div>
          <div slot="image" class="shipwrapper" :class="{'flex-column': !ship.horizontal }">
            <div v-for="(cell, c) in draggedShip.size" :key="c" class="gridcell"></div>
          </div>
        </Drag>
      </div>
    </v-row>-->
  </div>
</template>

<script>
import { Drag } from "vue-drag-drop";
export default {
  name: "fleet",
  components: { Drag },

  props: {
    placingShips: {
      type: Boolean
    }
  },

  data() {
    return {
      //test: false, //LATER REMOVE
      //fleetSpec: [
      //  {
      //    id: "ship1",
      //    type: "Aircraft Carrier",
      //    size: 5,
      //    placed: false,
      //    horizontal: true
      //  },
      //  {
      //    id: "ship2",
      //    type: "Battleship",
      //    size: 4,
      //    placed: false,
      //    horizontal: true
      //  },
      //  {
      //    id: "ship3",
      //    type: "Submarine",
      //    size: 3,
      //    placed: false,
      //    horizontal: true
      //  },
      //  {
      //    id: "ship4",
      //    type: "Destroyer",
      //    size: 3,
      //    placed: false,
      //    horizontal: true
      //  },
      //  {
      //    id: "ship5",
      //    type: "Patrol Boat",
      //    size: 2,
      //    placed: false,
      //    horizontal: true
      //  }
      //],
      //dragging: false,
      //draggedShip: {
      //  id: "",
      //  type: "",
      //  size: 0,
      //  placed: false,
      //  horizontal: true
      //}
    };
  },

  methods: {
    //handleDragStart(transferData) {
    //  this.draggedShip = transferData;
    //  setTimeout(() => {
    //    document.getElementById(transferData.shipType).style.zIndex = "-1";
    //    document.getElementById(transferData.shipType).style.border =
    //      "1px solid blue";
    //  }, 0);
    //},
    //handleDragEnd(transferData) {
    //  document.getElementById(transferData.shipType).style.zIndex = "0";
    //  //this.dragging = false;
    //},
    //
    //rotateShip() {
    //  //
    //},
    //
    //getImageUrl(shipSize, cell) {
    //  if (cell === 0) {
    //    return require("../assets/ship-hor-start.png");
    //  } else if (cell === shipSize - 1) {
    //    return require("../assets/ship-hor-end.png");
    //  } else {
    //    return require("../assets/ship-hor-body.png");
    //  }
    //}
  }
};
</script>

<style scoped>
/*.fleet-container {
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
}*/
</style>