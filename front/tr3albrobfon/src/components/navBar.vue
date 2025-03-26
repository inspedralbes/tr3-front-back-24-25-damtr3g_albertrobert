<template>
    <!-- Barra de navegación -->
    <v-app-bar
      app
      color="primary"
      dark
      class="navbar"
    >
      <!-- Título/Logo -->
      <v-toolbar-title>
        <router-link to="/" class="logo-link">Mi App</router-link>
      </v-toolbar-title>
  
      <v-spacer></v-spacer>
  
      <!-- Botones de navegación -->
      <v-btn
        v-for="(item, index) in navItems"
        :key="index"
        :to="item.route"
        text
        class="nav-btn"
      >
        <v-icon left>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
    data: () => ({
      navItems: [
        { title: 'Inicio', route: '/', icon: 'mdi-home' },
        { title: 'Productos', route: '/products', icon: 'mdi-package' },
        { title: 'Contacto', route: '/contact', icon: 'mdi-email' }
      ]
    })
  }
  </script>
  
  <style scoped>
  .navbar {
    width: 100%;
    margin: 0 !important;
    padding: 0 24px !important;
  }
  
  .logo-link {
    color: inherit !important;
    text-decoration: none;
  }
  
  .nav-btn {
    margin-left: 16px !important;
    transition: all 0.3s ease;
  }
  
  .nav-btn:hover {
    transform: translateY(-2px);
  }
  </style>