const express = require('express');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

// Configurar la base de dades amb Sequelize
const sequelize = new Sequelize('tr3_albrobfon', 'admin', 'jirafaCuadrada', {
    host: 'localhost',
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

// Configurar Express
const app = express();
const port = 4000;

app.use(cors({
    origin: 'http://localhost:3000', // Permet només el teu frontend
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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en funcionament a http://localhost:${port}`);
});
