<template>
    <v-container>
      <v-card>
        <v-card-title class="headline">Control en Tiempo Real</v-card-title>
        
        <v-card-text>
          <v-slider
            v-model="jumpForce"
            label="Fuerza de Salto"
            min="5"
            max="15"
            step="0.5"
            thumb-label
            @input="sendUpdate"
          ></v-slider>
  
          <v-slider
            v-model="speed"
            label="Velocidad"
            min="3"
            max="10"
            step="0.5"
            thumb-label
            @input="sendUpdate"
          ></v-slider>
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
        };
  
        this.ws.onerror = (error) => {
          console.error('Error WebSocket:', error);
        };
      },
  
      sendUpdate() {
        const config = {
          type: 'playerConfig',
          data: {
            jumpForce: this.jumpForce,
            speed: this.speed
          }
        };
        
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(config));
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