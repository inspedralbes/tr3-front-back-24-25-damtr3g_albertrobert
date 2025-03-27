<template>
  <!-- Componente de la barra de navegación -->
  <NavBar />
  <v-main>
    <PostImage/>
    <br>
    <SpawnConfig/>
    <br>
    <StatsTable/>
  </v-main>
</template>

<script>
import NavBar from '@/components/navBar.vue';
import PostImage from '@/components/PostImage.vue';
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

