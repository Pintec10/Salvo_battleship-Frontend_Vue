<template>
  <div>
    <div class="my-2 text-center">
      <h3 class="ma-0 font-weight-bold">Fleet Status</h3>
      <p>{{fleetStatus.gameplayer}}</p>
    </div>
    <div
      class="d-flex flex-column fleet-container"
      :class="{'align-start': isViewersFleet, 'align-end': !isViewersFleet}"
    >
      <div
        v-for="(ship, i) in fleetStatus"
        :key="i"
        class="shipwrapper relative d-flex mx-1 my-2"
        :id="'fleet-' + ship.type"
      >
        <!-- <div
        v-for="(ship, i) in fleetData"
        :key="i"
        class="shipwrapper relative d-flex mx-1 my-2"
        :id="'fleet-' + ship.type"
        >-->
        <div v-for="(cell, c) in ship.maxHP" :key="c" class="gridcell">
          <v-img :src="getImageUrl(ship.maxHP, c)" />
        </div>
        <div class="absolute d-flex">
          <div v-for="(cell, c) in ship.totalDamage" :key="c" class="gridcell hit-box">
            <v-icon color="red darken-2" size="5.5vmin">mdi-fire</v-icon>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "fleet",
  components: {},

  props: {
    isViewersFleet: {
      type: Boolean
    },
    viewerGPid: {
      type: String
    },
    fleetData: {
      type: Array
    },
    battleStatus: {
      type: Array
    },
    fleetStatus: {
      type: Object
    }
  },

  data() {
    return {};
  },

  methods: {
    getImageUrl(shipSize, cell) {
      if (cell === 0) {
        return require("../assets/ship-hor-start.png");
      } else if (cell === shipSize - 1) {
        return require("../assets/ship-hor-end.png");
      } else {
        return require("../assets/ship-hor-body.png");
      }
    },

    sufferedDamage() {
      this.gamedata.battleStatus.forEach(oneStatus => {
        if (oneStatus.gamePlayer != this.firingGamePlayerID) {
          //
        }
      });
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
  box-sizing: border-box;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
  top: 0;
}

.hit-box {
  background-color: hsla(0, 50%, 90%, 0.6);
}

.test2 {
  border: 1px solid green;
}
</style>