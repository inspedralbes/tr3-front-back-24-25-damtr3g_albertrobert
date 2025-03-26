require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const {connectDB, saveScore, Score} = require('./db');

// Configurar la base de dades amb Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

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

// Sincronitzar la base de dades
sequelize.sync();

// Connexió a MongoDB
connectDB();

// Configurar Express
const app = express();
const port = 4000;
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_ORIGIN, // Permet només el teu frontend
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type'
}));

// Configurar multer per a pujar imatges a la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

let gameConfig = {
    spawnRate: 2.0,
    minX: -36.0,
    maxX: 36.0,
    alternativeSpawnChance: 0.2
};

// Endpoint per a pujar una imatge
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const newImage = await Image.create({
            name: req.file.originalname,
            path: req.file.path
        });
        res.json({ message: 'Imatge pujada correctament', image: newImage });
    } catch (error) {
        res.status(500).json({ error: 'Error en pujar la imatge' });
    }
});

// Endpoint per obtenir una imatge per nom
app.get('/image/:name', async (req, res) => {
    try {
        const image = await Image.findOne({ where: { name: req.params.name } });
        if (!image) return res.status(404).json({ error: 'Imatge no trobada' });
        res.sendFile(path.resolve(image.path));
    } catch (error) {
        res.status(500).json({ error: 'Error en obtenir la imatge' });
    }
});

app.post('/api/scores', async (req, res) => {
    try {
      const score = req.body;
      const savedScore = await saveScore(score);
      res.status(201).json(savedScore);
    } catch (error) {
      res.status(500).json({ error: 'Error en guardar la puntuació' });
    }
});

// Obtenir totes les puntuacions
app.get('/api/scores', async (req, res) => {
    try {
      const scores = await Score.find().sort({ score: -1 }); // Ordena per puntuació descendent
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: 'Error en obtenir les puntuacions' });
    }
});
  
// Endpoint para guardar configuración
app.post('/api/config', (req, res) => {
    try {
      gameConfig = req.body;
      res.status(200).json(gameConfig);
    } catch (error) {
      res.status(500).json({ error: 'Error al guardar configuración' });
    }
});
  
  // Endpoint para obtener configuración (Unity)
app.get('/api/config', (req, res) => {
    res.status(200).json(gameConfig);
});

// Iniciar el servidor
app.listen(process.env.PORT, () => {
    console.log(`Servidor en funcionament a http://localhost:${process.env.PORT}`);
});
