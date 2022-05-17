const {Schema, model } = require('mongoose');

const concentradorSchema = Schema({
    fecha_alta:{
        type: Date,
        required: [true, 'El numero de concentrador es obligatorio by mongoose']
    },
    numero: {
        type: Number,
        required: [true, 'El numero de concentrador es obligatorio by mongoose'],
        unique: true
    },
    localidad: {
        type: String,
        required: [true, 'La localidad es obligatoria by mongoose']
    },
    calle: {
        type: String,
        required: [true, 'La calle es obligatoria by mongoose']
    },
    altura: {
        type: String,
        required: [true, 'La altura es obligatoria by mongoose']
    },
    ip: {
        type: String,
        required: [true, 'la direccionn IP es obligatoria by mongoose'],
        unique: true
    }
}, {collection: 'concentradores'});

module.exports = model('Concentrador', concentradorSchema);