const {Router} = require('express');
const { check } = require('express-validator');
const { webLogin, crearUsuario, loginUsuario } = require('../controladores/login');

const { ValDeCampos, existeEmail, esRolValido } = require('../middlewares/validacionesDeCampos');
const { validarJWT } = require('../middlewares/validacionesJWT');

const router = Router();

router.get('/', webLogin);

router.post('/', loginUsuario);

router.post('/registro',[
    //falta validacion si existe usuario
    validarJWT,
    check('email').custom( existeEmail ),
    check('rol').custom( esRolValido ),
    ValDeCampos
] , crearUsuario);
//router.get('/regcambios/logs', consultarLogs);
//router.post('/regcambios', [
//    check('descripcion','La descripcion es obligatoria').not().isEmpty(),
//    ValDeCampos],
//    agregarLog);


module.exports = router;