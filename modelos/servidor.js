const  path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { dbConexion } = require('../db/db_config');
const { validarJWT } = require('../middlewares/validacionesJWT');

class Servidor {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.concentradoresPath = '/api/concentradores';
        this.regCambiosPath = '/admin';
        this.loginPath = '/login';
        this.raizPath = '/';

        dbConexion();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public',{index:false}));
    }

    routes() {

        this.app.use(this.raizPath, require('../rutas/raiz'));

        this.app.use(this.concentradoresPath, require('../rutas/concentradores'));

        this.app.use(this.loginPath, require('../rutas/login'));

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