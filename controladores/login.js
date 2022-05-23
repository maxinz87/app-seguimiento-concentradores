const  path = require('path');
const bcryptjs = require('bcryptjs');
const Usuario = require('../modelos/usuario');
const { generarJWT } = require('../helpers/generarJWT');

const webLogin = (req, res) => {
    res.sendFile(path.join(__dirname,'../public/webs','login.html'));
}

const crearUsuario = async (req, res) => {
    
    const datos = req.body;

    try {
        
        const usuario = new Usuario(datos);

        //Verificar si el correo existe. esto se deberia hacer mediante un middleware.

        //Encriptado de contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.pwd = bcryptjs.hashSync(datos.pwd, salt);
        

        //guarda en DB
        await usuario.save();

        res.status(200).json({
            ok: true,
            usuario,
            uid:req.uid
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'error del servidor no manejado'
        });
    }
}

const loginUsuario = async (req, res) => {
    const {usuario, pwd} = req. body;

    try {

        //verifica sii existe usuario
        const consulta_usuario = await Usuario.findOne({usuario});

        console.log(consulta_usuario);
        if(!consulta_usuario){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no válido - usuario'
            });
        }

        //validar usuario activo - HACER

        //verificar contraseña
        const verificacionPassword = bcryptjs.compareSync(pwd, consulta_usuario.pwd);
        if(!verificacionPassword){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no válido - contraseña'
            });
        }

        //generar JWT
        console.log(`el id del usuario es ${consulta_usuario.id}`);
        const token = await generarJWT(consulta_usuario.id, consulta_usuario.rol); // se le pasa el id y rol del usuario logueado

        //se guarda el jwt en una cookie para mantener la sesion
        res.cookie('jwtvalido',token);
        
        res.status(200).json({
            ok:true,
            msg:"todo ok!",
            consulta_usuario
        });


    } catch (error) {
       return res.status(500).json({
           ok: false,
           msg: "hubo un error inesperado en el servidor"
       }); 
    }


}

module.exports = {
    webLogin,
    crearUsuario,
    loginUsuario
}