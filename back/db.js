const mongoose = require('mongoose');

// Schema pels resultats del joc
const scoreSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Model MongoDB
const Score = mongoose.model('Score', scoreSchema);

// Funció de connexió
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connectat');
  } catch (error) {
    console.error('Error de connexió a MongoDB:', error.message);
    process.exit(1);
  }
};

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

module.exports = {
  connectDB,
  saveScore,
  Score
};