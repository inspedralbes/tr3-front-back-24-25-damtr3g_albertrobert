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
    };
  },
  methods: {
    async uploadImage() {
      if (!this.file) return;
      const formData = new FormData();
      formData.append('image', this.file);

      try {
        const response = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
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
