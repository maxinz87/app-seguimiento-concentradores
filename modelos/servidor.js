const  path = require('path');
const express = require('express');
const cors = require('cors');
const { dbConexion } = require('../db/db_config');

class Servidor {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.concentradoresPath = '/api/concentradores';
        this.regCambiosPath = '/admin';

        dbConexion();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());

        this.app.use(express.static('public'));
    }

    routes() {

        this.app.use(this.concentradoresPath, require('../rutas/concentradores'));

        this.app.use(this.regCambiosPath, require('../rutas/admin'));

        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname,'../public','404.html'));
          });


    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`servidor Node activo desde el puerto ${this.port}`);
        });
    }
}

module.exports = Servidor;