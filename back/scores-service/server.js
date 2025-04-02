require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Score = mongoose.model('Score', {
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

app.post('/scores', async (req, res) => {
    try {
        const savedScore = await saveScore(req.body);
        res.status(201).json(savedScore);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la puntuación' });
    }
});

app.get('/scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 });
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las puntuaciones' });
    }
});

// Funció per guardar puntuació
const saveScore = async (playerData) => {
  try {
    const newScore = new Score(playerData);
    await newScore.save();
    console.log('Puntuació guardada correctament:', newScore);
    return newScore;
  } catch (error) {
    console.error('Error en guardar la puntuació:', error.message);
    throw error;
  }
};

// Verificació de MongoDB
const checkMongoDB = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return 'connected';
  } catch (error) {
    return 'disconnected';
  }
};

app.get('/health', async (req, res) => {
  res.json({
    status: 'active',
    database: await checkMongoDB(),
    records: await Score.countDocuments()
  });
});

app.listen(4004, () => {
  console.log('Scores Service funcionando en puerto 4004');
});