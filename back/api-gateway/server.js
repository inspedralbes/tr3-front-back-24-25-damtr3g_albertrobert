const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

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

app.listen(4000, () => {
  console.log('API Gateway funcionando en puerto 4000');
});