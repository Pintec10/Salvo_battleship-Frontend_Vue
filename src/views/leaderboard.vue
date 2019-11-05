<template>
  <div>
    <h1 class="text-center mt-3">Leaderboard</h1>
    <v-container class="my-3">
      <div v-if="loaded === true">
        <v-data-table :headers="headers" :items="sourcedata['scores_info']" :loading="!loaded"></v-data-table>
      </div>
    </v-container>
  </div>
</template>

<script>
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
          text: "Total score",
          value: "total_score",
          align: "center"
        }
      ]
    };
  },

  methods: {},

  created() {
    fetch("/api/games")
      .then(response => response.json())
      .then(json => {
        this.sourcedata = json;
        console.log(this.sourcedata);
        this.loaded = true;
      });
  }
};
</script>

<style>
</style>