<template>
  <v-container>
    <h1 class="text-center">Ship map</h1>
    <!--<p>gamedata: {{gamedata}}</p>
    <p>gameplayers: {{gamedata.gameplayers}}</p>-->

    <div v-if="loaded" class="d-flex justify-space-around">
      <div class="d-flex flex-column align-center">
        <h2>You: {{playerInfo(true, "name")}}</h2>
        <GameGrid
          :gamedata="gamedata"
          :rows="rows"
          :columns="columns"
          :isViewersGrid="true"
          :firingGamePlayerID="playerInfo(false, 'GPID')"
        />
      </div>
      <div class="d-flex flex-column align-center">
        <h2>Your opponent: {{playerInfo(false, "name")}}</h2>
        <GameGrid
          :gamedata="gamedata"
          :rows="rows"
          :columns="columns"
          :isViewersGrid="false"
          :firingGamePlayerID="playerInfo(true, 'GPID')"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
import GameGrid from "@/components/GameGrid.vue";

export default {
  name: "game_view",
  components: {
    GameGrid
  },

  data() {
    return {
      loaded: false,
      gamedata: {},
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    };
  },

  methods: {
    shipSort() {
      console.log("sorting ships...");
      this.gamedata.ships.forEach(item => item.location.sort());
    },

    playerInfo(isViewer, requestedInfo) {
      let outputInfo = "?";
      this.gamedata.gameplayers.forEach(gameplayer => {
        if (
          //for the present player
          isViewer === true &&
          gameplayer.id.toString() === this.$route.params.gpId.toString()
        ) {
          if (requestedInfo === "name") {
            outputInfo = gameplayer.player.username;
          }
          if (requestedInfo === "GPID") {
            outputInfo = gameplayer.id;
          }
        } else if (
          //for the opponent
          isViewer === false &&
          gameplayer.id.toString() !== this.$route.params.gpId.toString()
        ) {
          if (requestedInfo === "name") {
            outputInfo = gameplayer.player.username;
          }
          if (requestedInfo === "GPID") {
            outputInfo = gameplayer.id;
          }
        }
      });
      return outputInfo;
    }
  },

  computed: {},

  created() {
    fetch("/api/game_view/" + this.$route.params.gpId)
      .then(response => response.json())
      .then(json => {
        this.gamedata = json;
        this.shipSort();
        //console.log(this.gamedata);
        this.loaded = true;
      });
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