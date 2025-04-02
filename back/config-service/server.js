const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

let gameConfig = {
    spawnRate: 2.0,
    minX: -36.0,
    maxX: 36.0,
    alternativeSpawnChance: 0.2
};

app.get('/config', (req, res) => {
    res.status(200).json(gameConfig);
});

app.post('/config', (req, res) => {
    try {
        gameConfig = req.body;
        res.status(200).json(gameConfig);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la configuración' });
    }
});

app.get('/health', (req, res) => {
    res.json({
      status: 'active',
      configVersion: '1.2.3',
      lastUpdate: new Date().toISOString()
    });
});

app.listen(4003, () => {
  console.log('Config Service funcionando en puerto 4003');
});