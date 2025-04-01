<template>
    <v-container class="register-container">
      <v-card class="register-card" elevation="12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Registre</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="register">
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
  
            <v-text-field
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              label="Confirmar Contrasenya"
              required
              prepend-icon="mdi-lock-check"
              :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showConfirmPassword ? 'text' : 'password'"
              @click:append="showConfirmPassword = !showConfirmPassword"
            ></v-text-field>
  
            <v-alert v-if="error" type="error" dense class="mb-4">
              {{ error }}
            </v-alert>
  
            <v-alert v-if="success" type="success" dense class="mb-4">
              {{ success }}
            </v-alert>
  
            <v-btn
              type="submit"
              color="primary"
              block
              :loading="loading"
              :disabled="valid || loading"
            >
              Registrar-se
            </v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="goToLogin">
            Ja tens compte? Inicia sessió
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'Register',
    data: () => ({
      valid: true,
      username: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      error: '',
      success: '',
      usernameRules: [
        v => !!v || 'El nom d\'usuari és obligatori',
        v => (v && v.length >= 3) || 'El nom d\'usuari ha de tenir com a mínim 3 caràcters'
      ],
      passwordRules: [
        v => !!v || 'La contrasenya és obligatòria',
        v => (v && v.length >= 6) || 'La contrasenya ha de tenir com a mínim 6 caràcters'
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirmar la contrasenya és obligatori',
        v => v === this.password || 'Les contrasenyes no coincideixen'
      ]
    }),
    methods: {
      async register() {
        if (!this.$refs.form.validate()) return;
        
        this.loading = true;
        this.error = '';
        this.success = '';
        
        try {
          const response = await fetch('http://localhost:4000/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password
            })
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en el registre');
          }
  
          this.success = 'Registre completat amb èxit! Ara pots iniciar sessió.';
          this.username = '';
          this.password = '';
          this.confirmPassword = '';
          this.$refs.form.resetValidation();
        } catch (error) {
          this.error = error.message || 'Error en connectar amb el servidor';
        } finally {
          this.loading = false;
        }
      },
      goToLogin() {
        this.$router.push('/login');
      }
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1976D2, #2196F3);
  }
  .register-card {
    width: 100%;
    max-width: 450px;
  }
  </style>