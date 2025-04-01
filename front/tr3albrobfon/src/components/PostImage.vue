<template>
    <v-container>
      <v-card class="pa-4">
        <v-card-title>Upload d'imatge</v-card-title>
        <v-card-text>
          <v-file-input
            label="Selecciona una imatge"
            accept="image/*"
            v-model="file"
            show-size
          ></v-file-input>
          <v-btn :disabled="!file" color="primary" @click="uploadImage">
            Pujar Imatge
          </v-btn>
          <v-alert v-if="message" :type="messageType" class="mt-3">
            {{ message }}
          </v-alert>
  
          <!-- Mostrar imagen después de cargarla -->
          <v-img v-if="imageUrl" :src="imageUrl" class="mt-3" max-width="100%" />
        </v-card-text>
      </v-card>
    </v-container>
</template>
  
<script>
  export default {
    data() {
      return {
        file: null,
        message: '',
        messageType: 'info',
        imageUrl: '', // Variable para almacenar la URL de la imagen
      };
    },
    methods: {
      async uploadImage() {
        if (!this.file) return;
        const formData = new FormData();
        formData.append('image', this.file);
  
        try {
          const response = await fetch('http://localhost:4000/images/upload', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            const data = await response.json(); // Asumiendo que el servidor devuelve la URL
            this.imageUrl = `http://localhost:4000/images/${data.image.name}`; // Actualizar la URL de la imagen
            console.log(`http://localhost:4000/images/${data.image.name}`);
            this.message = 'Imatge pujada correctament!';
            this.messageType = 'success';
          } else {
            this.message = 'Error en pujar la imatge';
            this.messageType = 'error';
          }
        } catch (error) {
          this.message = 'Error en la connexió amb el servidor';
          this.messageType = 'error';
        }
      },
    },
  };
</script>
  