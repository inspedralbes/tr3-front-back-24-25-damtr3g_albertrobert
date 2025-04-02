<template>
    <v-app>
      <navBar />
      
      <v-main>
        <v-container class="mt-8">
          <v-row>
            <v-col cols="12">
              <h1 class="text-h4 mb-4">Gestió de Microserveis</h1>
            </v-col>
  
            <!-- Targeta per a cada microservei -->
            <v-col
              v-for="(service, index) in services"
              :key="index"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card class="pa-4">
                <v-card-title class="d-flex justify-space-between align-center">
                  <div>
                    <v-icon left>mdi-server</v-icon>
                    {{ service.name }}
                  </div>
                  <v-chip :color="getStatusColor(service.status)" dark>
                    {{ service.status }}
                  </v-chip>
                </v-card-title>
  
                <v-card-text>
                  <div class="text-caption">
                    Última comprovació: {{ service.lastChecked }}
                  </div>
                </v-card-text>
  
                <v-card-actions class="d-flex justify-end">
                  <v-btn
                    :color="service.status === 'active' ? 'error' : 'success'"
                    :loading="service.loading"
                    @click="toggleService(service)"
                  >
                    <v-icon left>
                      {{ service.status === 'active' ? 'mdi-power' : 'mdi-power-on' }}
                    </v-icon>
                    {{ service.status === 'active' ? 'Aturar' : 'Iniciar' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import navBar from '@/components/navBar.vue'
  
  export default {
    components: {
      navBar
    },
    data: () => ({
      services: [
        {
          name: 'API Gateway',
          baseUrl: 'http://localhost:4000',
          status: 'unknown',
          lastChecked: null,
          loading: false
        },
        {
          name: 'Auth Service',
          baseUrl: 'http://localhost:4001',
          status: 'unknown',
          lastChecked: null,
          loading: false
        },
        {
          name: 'Image Service',
          baseUrl: 'http://localhost:4002',
          status: 'unknown',
          lastChecked: null,
          loading: false
        },
        {
          name: 'Config Service',
          baseUrl: 'http://localhost:4003',
          status: 'unknown',
          lastChecked: null,
          loading: false
        },
        {
          name: 'Scores Service',
          baseUrl: 'http://localhost:4004',
          status: 'unknown',
          lastChecked: null,
          loading: false
        },
        {
          name: 'WebSocket Service',
          baseUrl: 'http://localhost:4005',
          status: 'unknown',
          lastChecked: null,
          loading: false
        }
      ],
      refreshInterval: null
    }),
    mounted() {
      this.checkAllStatus()
      this.refreshInterval = setInterval(this.checkAllStatus, 10000)
    },
    beforeDestroy() {
      clearInterval(this.refreshInterval)
    },
    methods: {
      async checkAllStatus() {
        this.services = await Promise.all(
          this.services.map(async service => {
            try {
              const response = await fetch(`${service.baseUrl}/health`)
              const data = await response.json()
              return {
                ...service,
                status: data.status || 'active',
                lastChecked: new Date().toLocaleTimeString()
              }
            } catch (error) {
              return {
                ...service,
                status: 'inactive',
                lastChecked: new Date().toLocaleTimeString()
              }
            }
          })
        )
      },
      getStatusColor(status) {
        return {
          active: 'green',
          inactive: 'red',
          unknown: 'orange'
        }[status] || 'grey'
      },
      async toggleService(service) {
        service.loading = true
        try {
          if (service.status === 'active') {
            await this.stopService(service)
          } else {
            await this.startService(service)
          }
          await this.checkAllStatus()
        } catch (error) {
          console.error('Error en canviar estat:', error)
        }
        service.loading = false
      },
      async startService(service) {
        // Implementa la crida a la teva API per iniciar el servei
        console.log(`Iniciant ${service.name}`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulació
      },
      async stopService(service) {
        // Implementa la crida a la teva API per aturar el servei
        console.log(`Aturant ${service.name}`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulació
      }
    }
  }
  </script>
  
  <style scoped>
  .v-card {
    transition: all 0.3s ease;
  }
  
  .v-card:hover {
    transform: translateY(-5px);
  }
  </style>