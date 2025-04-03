<template>
  <!-- Componente de la barra de navegación -->
  <NavBar />
  <v-main>
    <PostImage/>
    <br>
    <SpawnConfig/>
    <br>
    <RealTimeConfig/>
    <br>
    <StatsTable/>
    <br>
    <Chart/>
  </v-main>
</template>

<script>
import Chart from '@/components/chart.vue';
import NavBar from '@/components/navBar.vue';
import PostImage from '@/components/PostImage.vue';
import RealTimeConfig from '@/components/RealTimeConfig.vue';
import SpawnConfig from '@/components/SpawnConfig.vue';
import StatsTable from '@/components/StatsTable.vue';

export default {
  created() {
    if (!localStorage.getItem('authToken')) {
      this.$router.push('/login');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      this.$router.push('/login');
    }
  }
};
</script>

