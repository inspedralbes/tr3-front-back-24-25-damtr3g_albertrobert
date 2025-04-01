<template>
  <!-- Barra de navegació -->
  <v-app-bar
    app
    color="primary"
    dark
    class="navbar"
  >
    <!-- Títol/Logo -->
    <v-toolbar-title>
      <router-link to="/" class="logo-link">Web Tr3 Albert Robert</router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Botons de navegació -->
    <v-btn
      to="/services"
      text
      class="nav-btn"
    >
      <v-icon left>mdi-server</v-icon>
      Microserveis
    </v-btn>

    <v-btn
      text
      class="nav-btn"
      @click="logout"
    >
      <v-icon left>mdi-logout</v-icon>
      Tancar Sessió
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
name: 'NavBar',
methods: {
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.$router.push('/login');
  }
}
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