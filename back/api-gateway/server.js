const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
app.use(cors());

app.use('/auth', createProxyMiddleware({ 
  target: 'http://localhost:4001', 
  changeOrigin: true 
}));

app.use('/images', createProxyMiddleware({ 
  target: 'http://localhost:4002', 
  changeOrigin: true 
}));

app.use('/config', createProxyMiddleware({ 
  target: 'http://localhost:4003', 
  changeOrigin: true 
}));

app.use('/scores', createProxyMiddleware({ 
  target: 'http://localhost:4004', 
  changeOrigin: true 
}));

// Afegeix després de configurar Express
app.get('/health', (req, res) => {
  res.json({
    status: 'active',
    service: 'API Gateway',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// Endpoint per iniciar el servei
app.post('/start', (req, res) => {
  exec('pm2 start nom_del_servei', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error iniciant servei: ${stderr}`);
      return res.status(500).json({ success: false, error: stderr });
    }
    
    console.log(`Servei iniciat a ${new Date()}`);
    res.json({ 
      success: true, 
      message: 'Servei iniciat',
      output: stdout
    });
  });
});

// Endpoint per aturar el servei
app.post('/stop', (req, res) => {
  exec('pm2 stop nom_del_servei', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error aturant servei: ${stderr}`);
      return res.status(500).json({ success: false, error: stderr });
    }
    
    console.log(`Servei aturat a ${new Date()}`);
    res.json({ 
      success: true, 
      message: 'Servei aturat',
      output: stdout
    });
  });
});

// Endpoint para generar el gráfico
app.get('/api/generate-chart', (req, res) => {
  const pythonScriptPath = path.join(__dirname, 'generar_grafico.py');
  
  exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
      if (error) {
          console.error('Error ejecutando Python:', stderr);
          return res.status(500).json({ error: 'Error al generar el gráfico' });
      }
      
      try {
          const result = JSON.parse(stdout);
          if (result.error) {
              return res.status(400).json(result);
          }
          res.json(result);
      } catch (parseError) {
          console.error('Error parseando resultado:', parseError);
          res.status(500).json({ error: 'Error procesando el gráfico' });
      }
  });
});

app.listen(4000, () => {
  console.log('API Gateway funcionando en puerto 4000');
});