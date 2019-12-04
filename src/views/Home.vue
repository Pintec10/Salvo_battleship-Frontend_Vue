<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div>
      <Drop class="testdrop2" @drop="testhandledrop"></Drop>
      <Drag
        id="ciao"
        class="testdrag"
        effect-allowed="move"
        transfer-data="ciao"
        drop-effect="move"
      ></Drag>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Drag, Drop } from "vue-drag-drop";

export default {
  name: "home",
  components: { Drag, Drop },
  methods: {
    testhandledragstart(transferData) {
      console.log("handling dragstart ");
      console.log(transferData);
    },
    testhandledrop(transferData, nativeEvent) {
      console.log("handling drop ");
      console.log(transferData);
      nativeEvent.target.appendChild(document.getElementById("ciao"));
    }
  }
};
</script>

<style scoped>
.testdrop2 {
  width: 7vmin;
  height: 7vmin;
  background-color: blue;
}

.testdrag {
  width: 6vmin;
  height: 6vmin;
  background-color: green;
}
</style>
