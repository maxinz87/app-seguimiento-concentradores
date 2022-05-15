require('dotenv').config();

const Servidor = require('./modelos/servidor');


const servidor = new Servidor();

servidor.listen();