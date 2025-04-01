const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('Nuevo cliente WebSocket conectado');
  
    ws.on('message', (message) => {
      console.log('Mensaje recibido:', message); // ← Añade este log
      try {
        const data = JSON.parse(message);
        // Retransmitir a todos los clientes
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
            console.log("Dades WS enviades al Unity")
          }
        });
      } catch (error) {
        console.error('Error procesando mensaje:', error);
      }
    });
  
    ws.on('close', () => {
      console.log('Cliente WebSocket desconectado');
    });
});

server.listen(4005, () => {
  console.log('WebSocket Service funcionando en puerto 4005');
});