<template>
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn 
            color="primary" 
            @click="fetchChartData"
            :loading="loading"
          >
            Generar Gráfico
          </v-btn>
        </v-col>
  
        <v-col cols="12" v-if="error">
          <v-alert type="error">
            {{ error }}
          </v-alert>
        </v-col>
  
        <v-col cols="12" md="8" v-if="chartImage" class="mx-auto">
          <v-card>
            <v-card-title class="headline">Gráfico de Puntuaciones</v-card-title>
            <v-card-text>
              <img :src="chartImage" alt="Gráfico de puntuaciones" style="width: 100%;">
              
              <v-data-table
                :headers="headers"
                :items="tableData"
                class="mt-4"
                v-if="tableData.length > 0"
              ></v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: false,
        chartImage: null,
        error: null,
        headers: [
          { text: 'Fecha', value: 'date' },
          { text: 'Puntuación', value: 'score' }
        ],
        tableData: []
      }
    },
    methods: {
      async fetchChartData() {
        this.loading = true;
        this.error = null;
        
        try {
          const response = await fetch('http://localhost:4000/api/generate-chart');
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Error al obtener el gráfico');
          }
          
          this.chartImage = data.chartImage;
          this.tableData = data.dates.map((date, index) => ({
            date,
            score: data.scores[index]
          }));
          
        } catch (err) {
          this.error = err.message;
          console.error('Error:', err);
        } finally {
          this.loading = false;
        }
      }
    }
  }
  </script>