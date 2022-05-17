const {Router} = require('express');
const { check } = require('express-validator');
const { agregarConcentrador,
        listarConcentradores,
        eliminarConcentrador, 
        listarConcentrador} = require('../controladores/concentradores');
const { ValDeCampos, existeConcentrador, existeCampo } = require('../middlewares/validacionesDeCampos');

const router = Router();

router.get('/', listarConcentradores);

router.get('/:id', listarConcentrador);

router.post('/', [
    check('numero', 'El nro de concentrador es obligatorio').not().isEmpty({delimiters:'-'}),
    check('fecha_alta','La fecha debe ser válida').isISO8601(),
    check('localidad', 'La localidad es obligatoria').not().isEmpty(),
    check('calle', 'La calle es obligatoria').not().isEmpty(),
    check('altura', 'La altura es obligatoria').not().isEmpty(),
    check('ip', 'La direccion IP es obligatoria').not().isEmpty(),
    existeCampo('numero'),
    existeCampo('ip'),
    ValDeCampos
], agregarConcentrador);

router.delete('/:id', [
    check('id', 'El id de concentrador es obligatorio').isMongoId()
], eliminarConcentrador);

module.exports = router;