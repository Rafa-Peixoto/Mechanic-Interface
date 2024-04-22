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

