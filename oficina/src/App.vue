<template>  
  <div>
    <CustomNavbar  v-if="showNavbar"></CustomNavbar>
    <router-view></router-view>
  </div>
</template>

<script>
import CustomNavbar from './components/CustomNavbar.vue'
import {computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  components: {
    CustomNavbar
  },
  setup(){
    const route = useRoute();
    const showNavbar = computed(() => {
      const noNavbarRoutes = ['/login'];
      return !noNavbarRoutes.includes(route.path.toLowerCase());
    });
    return {showNavbar};
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

/* Estilo global que afeta todos os elementos do body */
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f0fff0; /* background verde claro */
}

</style>