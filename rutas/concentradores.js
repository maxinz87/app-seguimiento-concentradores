const {Router} = require('express');
const { check } = require('express-validator');
const { agregarConcentrador,
        listarConcentradores,
        eliminarConcentrador, 
        listarConcentrador,
        actualizarConcentrador} = require('../controladores/concentradores');
const { ValDeCampos, existeConcentrador, existeCampo } = require('../middlewares/validacionesDeCampos');
const { validarJWT } = require('../middlewares/validacionesJWT');

const router = Router();


router.get('/:tipo/:termino', [
//    validarJWT,
//    ValDeCampos
], listarConcentradores);

router.get('/:id', [
    //validarJWT,
    //ValDeCampos
], listarConcentrador);

router.post('/', [
    validarJWT,
    check('numero', 'El nro de concentrador debe ser válido').isNumeric(),
    check('numero', 'El nro de concentrador debe ser de 8 dígitos').isLength({ min: 8, max:8 }),
    check('fecha_alta','La fecha debe ser válida').isISO8601(),
    check('localidad', 'La localidad es obligatoria').not().isEmpty(),
    check('calle', 'La calle es obligatoria').not().isEmpty(),
    check('altura', 'La altura es obligatoria').not().isEmpty(),
    check('nro_usuarios_mono','El nro de usuario monofasicos debe ser válido').isNumeric(),
    check('nro_usuarios_tri','El nro de usuarios trifásicos debe ser válido').isNumeric(),
    check('nro_alumbrados','El nro de alumbrados debe ser válido').isNumeric(),
    check('ip', 'La direccion IP es obligatoria').not().isEmpty(),
    existeCampo('numero'),
    existeCampo('ip'),
    ValDeCampos
], agregarConcentrador);

router.put('/:id', [
    validarJWT,
    existeCampo('ip'),
    ValDeCampos
], actualizarConcentrador);

router.delete('/:id', [
    validarJWT,
    check('id', 'El id de concentrador es obligatorio').isMongoId(),
    ValDeCampos
], eliminarConcentrador);

module.exports = router;