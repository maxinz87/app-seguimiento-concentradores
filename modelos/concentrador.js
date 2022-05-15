const {Schema, model } = require('mongoose');

const concentradorSchema = Schema({
    numero: {
        type: Number,
        required: [true, 'El numero de concentrador es obligatorio'],
        unique: true
    },
    ubicacion: {
        type: String,
        required: [true, 'La ubicacion es obligatoria']
    },
    ip: {
        type: String,
        required: [true, 'la direccionn IP es obligatoria'],
        unique: true
    }
}, {collection: 'concentradores'});

module.exports = model('Concentrador', concentradorSchema);