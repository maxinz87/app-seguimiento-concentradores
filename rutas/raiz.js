const {Router} = require('express');
const { check } = require('express-validator');
const { webPrincipal } = require('../controladores/raiz');
const { ValDeCampos } = require('../middlewares/validacionesDeCampos');
const { validarJWT } = require('../middlewares/validacionesJWT');

const router = Router();

router.get('', [
    validarJWT,
    ValDeCampos
], webPrincipal);

module.exports = router;