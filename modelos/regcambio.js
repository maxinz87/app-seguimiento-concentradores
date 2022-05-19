const {Schema, model } = require('mongoose');

const regCambioSchema = Schema({
    fecha:{
        type: Date,
        default: Date.now(),
        required: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria by mongoose']
    }
});

module.exports = model('Regcambio', regCambioSchema);