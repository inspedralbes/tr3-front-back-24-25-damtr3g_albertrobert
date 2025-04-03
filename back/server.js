require('dotenv').config();
const express = require('express');
const http = require('http');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const { connectDB, saveScore, Score } = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');

// Configuración de Sequelize (MySQL)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

// Modelo Image
const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Modelo User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sincronizar modelos MySQL
sequelize.sync();

// Configurar Express y WebSocket
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración de Multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Configuración del juego
let gameConfig = {
  spawnRate: 2.0,
  minX: -36.0,
  maxX: 36.0,
  alternativeSpawnChance: 0.2
};

// WebSocket Server
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

// Middleware de autenticación JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Endpoints
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = await Image.create({
      name: req.file.originalname,
      path: req.file.path
    });
    res.json({ message: 'Imagen subida correctamente', image: newImage });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

app.get('/image/:name', async (req, res) => {
  try {
    const image = await Image.findOne({ where: { name: req.params.name } });
    if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });
    res.sendFile(path.resolve(image.path));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la imagen' });
  }
});

app.post('/api/scores', async (req, res) => {
  try {
    const savedScore = await saveScore(req.body);
    res.status(201).json(savedScore);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la puntuación' });
  }
});

app.get('/api/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las puntuaciones' });
  }
});

app.post('/api/config', (req, res) => {
  try {
    gameConfig = req.body;
    res.status(200).json(gameConfig);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la configuración' });
  }
});

app.get('/api/config', (req, res) => {
  res.status(200).json(gameConfig);
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
});

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: `Bienvenido ${req.user.username}! Ruta protegida` });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});