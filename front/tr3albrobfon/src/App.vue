
<template>
  <v-app>
    <!-- Contenido principal -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<!-- <script>
  import NavBar from '@/components/navBar.vue';
</script> -->
<script>
  export default {
    created() {
      this.$router.push('/login'); // Redirigeix a login
    }
  }
</script>