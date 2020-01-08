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

      <!-- here testing socket -->
      <div>
        <h3>here to show communication with server...</h3>
        <p>{{testSocketText}}</p>
      </div>
      <div class="my-2">
        <v-text-field v-model="testInputText"></v-text-field>
        <v-btn @click="sendMessage(testInputText)">SEND MESSAGE</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
//const proxi = "https://infinite-shore-25867.herokuapp.com";
const proxi = "";

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
      ],

      //for socket testing
      websocket: null,
      testSocketText: "",
      testInputText: ""
    };
  },

  //these methods are for testing websocket
  methods: {
    processOpen(message) {
      console.log("opening connection with server");
      this.testSocketText += "Opening connection on message: " + message + "\n";
    },

    processClose(message) {
      this.testSocketText += "Closing connection on message: " + message + "\n";
      console.log("closing connection with server");
      this.websocket.send("client disonnected"); // had to add a "this" here... correct?
    },

    processError(message) {
      console.log("there was an error");
      this.testSocketText += "An error occurred: " + message + "\n";
    },

    processMessage(message) {
      this.testSocketText +=
        "Receive this message from server: " + message + "\n";
    },

    sendMessage(inputMessage) {
      this.websocket.send(inputMessage);
      if (inputMessage !== "close") {
        this.testSocketText +=
          "Sent this message to server: " + inputMessage + "\n";
        this.testInputText = "";
      } else {
        this.websocket.close();
      }
    }
  },

  created() {
    fetch(proxi + "/api/games", { credentials: "include" })
      .then(response => response.json())
      .then(json => {
        this.sourcedata = json;
        this.loaded = true;
      });

    //here testing socket initialization with created; check URL @ 8:50 in YT
    // also check if necessary to change arrow function
    this.websocket = new WebSocket("ws://localhost:8080/salvo/serverEndpoint");
    //this.websocket = new WebSocket("ws://localhost:8080/salvo/serverEndpoint");
    this.websocket.onopen = message => {
      this.processOpen(message);
    };
    this.websocket.onclose = message => {
      this.processClose(message);
    };
    this.websocket.onError = () => {
      this.processError();
    };
    this.websocket.onmessage = message => {
      this.processMessage(message);
    };
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