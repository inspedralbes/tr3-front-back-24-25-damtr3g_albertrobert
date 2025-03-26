
<template>
  <v-app>
    <!-- Componente de la barra de navegación -->
    <NavBar />

    <!-- Contenido principal -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  import NavBar from '@/components/navBar.vue';
</script>
