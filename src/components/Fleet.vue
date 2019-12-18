<template>
  <div>
    <div class="my-2 text-center">
      <h3 class="ma-0 font-weight-bold">Fleet Status</h3>
      <p v-if="fleetStatus.length === 0" class="mt-5">Waiting for ship placement...</p>
    </div>

    <div v-if="fleetStatus.length === 0" class="d-flex">
      <div v-for="(cell, i) in 5" :key="i" class="gridcell"></div>
    </div>

    <div
      class="d-flex flex-column fleet-container"
      :class="{'align-start': isViewersFleet, 'align-end': !isViewersFleet}"
    >
      <div
        v-show="!updatingFleet"
        v-for="(ship, i) in fleetStatus"
        :key="i"
        class="shipwrapper relative d-flex mx-1 my-2 water"
        :id="'fleet-' + ship.type"
      >
        <!-- ship display (both players) -->
        <div v-for="(cell, c) in ship.maxHP" :key="c" class="gridcell">
          <v-img v-if="!ship.isSunk" :src="getImageUrl(ship.maxHP, c)" />
        </div>

        <!-- damage display (viewer only) -->
        <div v-if="!ship.isSunk" class="absolute d-flex">
          <div v-for="(cell, c) in ship.totalDamage" :key="c" class="gridcell hit-box">
            <v-img src="../assets/fire_07.gif"></v-img>
          </div>
        </div>

        <!-- sunken state display (both players) -->
        <div v-if="ship.isSunk" class="absolute d-flex">
          <div v-for="(cell, c) in ship.maxHP" :key="c" class="gridcell hit-box">
            <v-img src="../assets/smoke_15.gif"></v-img>
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
    updatingFleet: {
      type: Boolean
    } /*
    battleStatus: {
      type: Array
    },*/,
    fleetStatus: {
      type: Array
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
    },

    organizeFleet(fleet) {
      fleet.sort(function(ship1, ship2) {
        if (ship1.maxHP === ship2.maxHP) {
          if (ship1.type === "Destroyer") {
            return -1;
          } else return 1;
        } else {
          return ship2.maxHP - ship1.maxHP;
        }
      });
    }
  },

  created() {
    if (this.fleetStatus.length > 1) {
      this.fleetStatus.sort((a, b) => (a.maxHP < b.maxHP ? 1 : -1));
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
  background-color: hsla(0, 70%, 60%, 0.5);
}

.water {
  background-image: url("../assets/water.jpg");
  background-image: url("../assets/giphy_water_1.gif");
  /* background-image: url("https://media.giphy.com/media/SHUu78CIqq4FO/giphy.gif"); */
  /*background-image: url("https://media.giphy.com/media/hqaaJowDvwv60/giphy.gif");*/
}

.test2 {
  border: 1px solid green;
}
</style>