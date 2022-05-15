const mongoose = require('mongoose');

const dbConexion = async () => {
    try {
        await mongoose.connect( process.env.MONGODB_CONEXION );
        console.log('conectado a la base de datos');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos');
    }
}


module.exports = {
    dbConexion
}