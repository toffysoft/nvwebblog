<template>
  <div id="app">
    <!-- <back-header /> -->
    <router-view  />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
body {
  margin:0;
  padding:0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Fade transition */
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-enter-active, .fade-leave-active {    
    transition: opacity 0.3s;
}

.fade-enter-to {
    opacity: 1;
}
</style>
