<template>
  <div class="background">
    <v-container>
      <h1 class="text-center my-3">Leaderboard</h1>

      <div>
        <v-data-table
          class="table-main"
          :headers="headers"
          :items="sourcedata['scores_info']"
          :loading="!loaded"
          sort-by="total_score"
          :sort-desc="true"
        ></v-data-table>
      </div>
      
    </v-container>
  </div>
</template>

<script>
const proxi = "https://infinite-shore-25867.herokuapp.com"; //COMMENT FOR LOCAL BUILD
//const proxi = ""; //RESTORE FOR LOCAL BUILD

export default {
  name: "leaderboard",

  data() {
    return {
      loaded: false,
      sourcedata: {},
      headers: [
        {
          text: "Player",
          value: "player_name",
          align: "center"
        },
        {
          text: "Games won",
          value: "count_won",
          align: "center"
        },
        {
          text: "Games tied",
          value: "count_draw",
          align: "center"
        },
        {
          text: "Games lost",
          value: "count_lost",
          align: "center"
        },
        {
          text: "Games played",
          value: "count_played",
          align: "center"
        },
        {
          text: "Total score",
          value: "total_score",
          align: "center"
        }
      ]
    };
  },

  created() {
    fetch(proxi + "/api/games", { credentials: "include" })
      .then(response => response.json())
      .then(json => {
        this.sourcedata = json;
        this.loaded = true;
      });
  }
};
</script>

<style scoped>
.background {
  background-image: url("../assets/medal_02.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  height: 100%;
}
.table-main {
  background-color: hsla(0, 50%, 0%, 0.8) !important;
}
</style>