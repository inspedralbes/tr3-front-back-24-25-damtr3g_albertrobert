<template>
    <v-container>
      <v-card>
        <v-card-title class="headline">Configuración de Plataformas</v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="submitConfig">
            <v-text-field
              v-model.number="config.spawnRate"
              label="Intervalo de Spawn (segundos)"
              type="number"
              step="0.1"
              required
            ></v-text-field>
  
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="config.minX"
                  label="Posición Mínima X"
                  type="number"
                  step="0.1"
                  required
                ></v-text-field>
              </v-col>
              
              <v-col cols="6">
                <v-text-field
                  v-model.number="config.maxX"
                  label="Posición Máxima X"
                  type="number"
                  step="0.1"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
            <v-slider
              v-model="config.alternativeSpawnChance"
              label="Probabilidad Plataforma Especial"
              min="0"
              max="1"
              step="0.01"
              thumb-label
            ></v-slider>
  
            <v-btn 
              color="primary" 
              type="submit"
              :loading="loading"
            >
              Guardar Configuración
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
</template>
  
<script>
  export default {
    data: () => ({
      loading: false,
      config: {
        spawnRate: 2.0,
        minX: -5.0,
        maxX: 5.0,
        alternativeSpawnChance: 0.2
      }
    }),
  
    methods: {
      async submitConfig() {
        this.loading = true;
        try {
          const response = await fetch('http://localhost:4000/config/config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.config)
          });
          
          if (!response.ok) throw new Error('Error en el servidor');
          
          alert('Configuración guardada correctamente!');
        } catch (error) {
          alert(error.message);
        } finally {
          this.loading = false;
        }
      }
    }
  };
</script>