const {Router} = require('express');
const { check } = require('express-validator');
const { webRegCambios, agregarLog, consultarLogs } = require('../controladores/admin');
const { ValDeCampos } = require('../middlewares/validacionesDeCampos');
const { validarJWT } = require('../middlewares/validacionesJWT');

const router = Router();

router.get('/regcambios', [
    validarJWT,
    ValDeCampos
], webRegCambios);

router.get('/regcambios/logs', consultarLogs);

router.post('/regcambios', [
    check('descripcion','La descripcion es obligatoria').not().isEmpty(),
    ValDeCampos],
    agregarLog);


module.exports = router;