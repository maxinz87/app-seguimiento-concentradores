const {Schema, model } = require('mongoose');

const usuario_roleSchema = Schema({
    rol:{
        type: String,
        required: [true, 'el rol es obligatoria by mongoose'],
        unique: true
    }

});

module.exports = model('Usuario_role', usuario_roleSchema);