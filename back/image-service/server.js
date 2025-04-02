require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
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

sequelize.sync();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: './image-service/uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

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

app.get('/:name', async (req, res) => {
    try {
      const image = await Image.findOne({ where: { name: req.params.name } });
      if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });
      res.sendFile(path.resolve(image.path));
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la imagen' });
    }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'active',
    storage: fs.existsSync('./uploads') ? 'OK' : 'ERROR',
    files: fs.readdirSync('./uploads').length
  });
});

app.listen(4002, () => {
  console.log('Image Service funcionando en puerto 4002');
});