const {Schema, model } = require('mongoose');

const usuarioSchema = Schema({
    usuario:{
        type: String,
        required: [true, 'el usuario es obligatoria by mongoose'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'el email es obligatorio by mongoose'],
        unique: true
    },
    pwd: {
        type: String,
        required: [true, 'la contraseña es obligatoria by mongoose'],
    },
    rol: {
        type: String,
        default: 'USUARIO_ROL',
        required: [true, 'el rol es obligatorio by mongoose']
    },
    activo: {
        type: Boolean,
        default: true,
        require: true
    }

});

//se remueven campos __v y pwd al momento de hacer consultas a la DB y mostrarlo como respuesta JSON
usuarioSchema.methods.toJSON = function() {
    const { __v, pwd, ...resto } = this.toObject();
    return resto;
}

module.exports = model('Usuario', usuarioSchema);