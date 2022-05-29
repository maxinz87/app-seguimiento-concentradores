const {Schema, model } = require('mongoose');

const concentradorSchema = Schema({
    fecha_alta:{
        type: Date,
        required: [true, 'El numero de concentrador es obligatorio by mongoose']
    },
    numero: {
        type: String,
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
    nro_usuarios_mono:{
        type: Number,
        required: true,
        default: 0
    },
    nro_usuarios_tri:{
        type: Number,
        required: true,
        default: 0
    },
    nro_alumbrados:{
        type: Number,
        required: true,
        default: 0
    },
    observaciones:{
        type: String
    },
    ip: {
        type: String,
        required: [true, 'la direccionn IP es obligatoria by mongoose'],
        unique: true
    }
}, {collection: 'concentradores'});

module.exports = model('Concentrador', concentradorSchema);