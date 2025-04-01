<template>
  <v-container>
    <v-card>
      <v-card-title class="headline">Control en Tiempo Real</v-card-title>
      
      <v-card-text>
        <v-slider
          v-model="jumpForce"
          label="Fuerza de Salto"
          min="5"
          max="1000"
          step="1"
          thumb-label
        ></v-slider>

        <v-slider
          v-model="speed"
          label="Velocidad"
          min="3"
          max="100"
          step="1"
          thumb-label
        ></v-slider>

        <!-- Botón para enviar los valores -->
        <v-btn 
          color="primary"
          @click="sendUpdate"
          block
        >
          Enviar configuración
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    jumpForce: 7,
    speed: 5,
    ws: null
  }),

  mounted() {
    this.connectWebSocket();
  },

  methods: {
    connectWebSocket() {
      this.ws = new WebSocket('ws://localhost:4000/ws');

      this.ws.onopen = () => {
        console.log('Conexión WebSocket establecida');
        // Enviar valores iniciales al conectar
        this.sendUpdate();
      };

      this.ws.onerror = (error) => {
        console.error('Error WebSocket:', error);
      };

      this.ws.onclose = () => {
        console.log('Conexión WebSocket cerrada');
      };
    },

    sendUpdate() {
      console.log("Ejecutando sendUpdate");
      const config = {
        type: 'playerConfig',
        data: {
          jumpForce: this.jumpForce,
          speed: this.speed
        }
      };
      
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(config));
        console.log("Datos enviados:", config);
      } else {
        console.error("WebSocket no está conectado");
      }
    }
  },

  beforeDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  }
};
</script>