<template>
  <v-container>
    <h1>Ship map</h1>
    <p>gamedata.ships:{{gamedata.ships}}</p>
    <div class="my-3" v-if="loaded">
      <!--first row -->
      <div class="d-flex">
        <div class="gridcell"></div>
        <div v-for="(column, j) in columns" :key="j" class="gridcell text-center">{{columns[j]}}</div>
      </div>
      <!-- grid rows, with row names -->
      <div v-for="(row, i) in rows" :key="i" class="d-flex">
        <div class="gridcell">{{rows[i]}}</div>
        <div v-for="(column, j) in columns" :key="j">
          <div class="gridcell bordered">
            <span v-if="shipPresent(i, j)">X</span>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
//import
export default {
  name: "game_view",
  components: {},

  data() {
    return {
      loaded: false,
      gamedata: {},
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    };
  },

  methods: {
    cellname(row, col) {
      return (this.rows[row] + this.columns[col]).toString();
    },

    shipPresent(row, col) {
      let examinedCase = this.cellname(row, col);
      for (let ship in this.gamedata.ships) {
        if (
          this.gamedata.ships[ship].location.some(
            occupiedCase => occupiedCase === examinedCase
          )
        ) {
          return true;
        }
      }
      return false;
    }
  },

  computed: {
    //
  },

  created() {
    fetch("/api/game_view/" + this.$route.params.gpId)
      .then(response => response.json())
      .then(json => {
        this.gamedata = json;
        this.loaded = true;
      });
  }
};
</script>

<style scoped>
.gridcell {
  width: 6vmin;
  height: 6vmin;
}

.bordered {
  border: 1px solid black;
}
</style>