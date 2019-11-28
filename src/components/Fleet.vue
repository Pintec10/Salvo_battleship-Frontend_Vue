<template>
  <div>
    <p v-show="!dragging">Fleet</p>
    <v-row class="d-flex flex-wrap fleet-container">
      <div v-for="(ship, i) in fleetSpec" :key="i">
        <!-- <p>{{ship.type}}</p> -->
        <Drag
          class="shipwrapper d-flex"
          :id="ship.id"
          :transfer-data="ship"
          :draggable="placingShips"
          @drag="handleDragStart"
          @dragend="handleDragEnd"
          v-show="!dragging"
        >
          <div v-for="(cell, c) in ship.size" :key="c" class="gridcell" drop-effect="move">{{cell}}</div>
          <div slot="image" class="shipwrapper d-flex">
            <div v-for="(cell, c) in ship.size" :key="c" class="gridcell">{{cell}}</div>
          </div>
        </Drag>
      </div>
    </v-row>
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
          orientation: "horizontal"
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
      dragging: false
    };
  },

  methods: {
    handleDragStart() {
      console.log("this is dragstart");
      this.dragging = true;
    },
    handleDragEnd() {
      console.log("this is dragend");
      this.dragging = false;
    }
  }
};
</script>

<style scoped>
.fleet-container {
  width: 50vh;
}

.shipwrapper {
  border: 0.1px solid green;
  z-index: 1;
  background-color: white;
}

.gridcell {
  width: 5vmin;
  height: 5vmin;
  background-size: cover;
  box-sizing: border-box;
}

/*.absolute {
  position: absolute;
}*/
</style>