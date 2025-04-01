<template>
    <v-container fluid>
      <v-card>
        <v-card-title class="d-flex align-center">
          <span class="text-h5">Historial de Puntuacions</span>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            @click="fetchScores"
            :loading="loading"
            depressed
          >
            <v-icon left>mdi-refresh</v-icon>
            Actualitzar
          </v-btn>
        </v-card-title>
  
        <v-card-text>
          <v-alert
            v-if="error"
            type="error"
            dense
            outlined
            class="mb-4"
          >
            Error en carregar dades: {{ error }}
          </v-alert>
  
          <v-data-table
            :headers="headers"
            :items="scores"
            :loading="loading"
            :items-per-page="10"
            class="elevation-1"
          >
            <!-- Capçaleres personalitzades -->
            <template v-slot:header="{ headers }">
              <thead>
                <tr>
                  <th
                    class="text-center primary--text font-weight-bold px-4 py-3"
                    style="background-color: #f8f9fa; font-size: 1.1em;"
                  >
                    Score
                  </th>
                  <th
                    class="text-center primary--text font-weight-bold px-4 py-3"
                    style="background-color: #f8f9fa; font-size: 1.1em;"
                  >
                    Date
                  </th>
                </tr>
              </thead>
            </template>
  
            <!-- Cos de la taula -->
            <template v-slot:item.score="{ item }">
              <span class="font-weight-bold">{{ item.score }}</span>
            </template>
  
            <template v-slot:item.date="{ item }">
              <v-icon small class="mr-2">mdi-clock-outline</v-icon>
              {{ formatDate(item.date) }}
            </template>
  
            <template v-slot:no-data>
              <v-alert
                type="info"
                class="ma-4"
              >
                No hi ha registres de puntuacions disponibles
              </v-alert>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
</template>
  
<script>
  export default {
    data: () => ({
      loading: false,
      error: null,
      scores: [],
      headers: [
        { 
          text: 'Score',  // Text del header
          value: 'score', // Camp de dades
          align: 'center',
          sortable: true
        },
        { 
          text: 'Data',   // Text del header
          value: 'date',  // Camp de dades
          align: 'center',
          sortable: true
        }
      ],
    }),
  
    methods: {
      async fetchScores() {
        this.loading = true;
        this.error = null;
        
        try {
          const response = await fetch('http://localhost:4000/scores/scores');
          
          if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
          
          const data = await response.json();
          this.scores = data.map(item => ({
            ...item,
            date: new Date(item.date).toISOString()
          }));
          
        } catch (err) {
          this.error = err.message;
          console.error('Error:', err);
        } finally {
          this.loading = false;
        }
      },
      formatDate(date) {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Madrid'
        };
        return new Date(date).toLocaleDateString('ca-ES', options);
      }
    },
    mounted() {
      this.fetchScores();
    }
  };
</script>
  
<style scoped>
  .v-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }
  
  .v-data-table-header th {
    letter-spacing: 0.5px;
    border-bottom: 2px solid #dee2e6 !important;
  }
</style>
