<template>
    <v-container class="login-container">
      <v-card class="login-card" elevation="12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Iniciar Sessió</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="login">
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              label="Nom d'usuari"
              required
              prepend-icon="mdi-account"
            ></v-text-field>
  
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Contrasenya"
              required
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
  
            <v-alert v-if="error" type="error" dense class="mb-4">
              {{ error }}
            </v-alert>
  
            <v-btn
              type="submit"
              color="primary"
              block
              :loading="loading"
              :disabled="!valid || loading"
            >
              Iniciar Sessió
            </v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="goToRegister">
            No tens compte? Registra't
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'Login',
    data: () => ({
      valid: true,
      username: '',
      password: '',
      showPassword: false,
      loading: false,
      error: '',
      usernameRules: [
        v => !!v || 'El nom d\'usuari és obligatori',
        v => (v && v.length >= 3) || 'El nom d\'usuari ha de tenir com a mínim 3 caràcters'
      ],
      passwordRules: [
        v => !!v || 'La contrasenya és obligatòria',
        v => (v && v.length >= 6) || 'La contrasenya ha de tenir com a mínim 6 caràcters'
      ]
    }),
    methods: {
    async login() {
        try {
            const response = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.username,
                password: this.password
            })
            });
            // Verificar si la resposta és correcta (2xx)
            if (response.ok) {
              const data = await response.json();
              
              // Guardar a localStorage
              localStorage.setItem('authToken', data.token);
              localStorage.setItem('username', data.username);
              
              this.$router.push('/');
            } else {
              // Si la resposta és d'error (401, 404, etc.)
              const errorData = await response.json(); // Suposant que el servidor retorna JSON amb detalls de l'error
              console.error("Error:", errorData.message || "Credencials Incorrectes");
              
              // Opcional: Mostrar missatge a l'usuari
              alert(errorData.message || "Credencials Incorrectes");
            }
        } catch (error) {
            console.error('Error al login:', error);
        }
    },
      goToRegister() {
        this.$router.push('/register');
      }
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1976D2, #2196F3);
  }
  .login-card {
    width: 100%;
    max-width: 450px;
  }
  </style>