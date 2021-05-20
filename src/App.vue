<template>
  <div id="app">
    <Container />
  </div>
</template>
<script>
import Container from "./components/Container.vue";

export default {
  name: "App",
  components: {
    Container
  }
};
</script>

<style lang="sass">
body,html
  margin: 0
  width: 100%
  height: 100%
  overflow: hidden
#app
  width: 100%
  height: 100%
  overflow: hidden
</style>
