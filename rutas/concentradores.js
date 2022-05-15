const {Router} = require('express');
const { check } = require('express-validator');
const { agregarConcentrador,
        listarConcentradores,
        eliminarConcentrador } = require('../controladores/concentradores');
const { ValDeCampos, existeConcentrador, existeCampo } = require('../middlewares/validacionesDeCampos');

const router = Router();

router.get('/', listarConcentradores);

router.post('/', [
    check('numero', 'El nro de concentrador es obligatorio').not().isEmpty(),
    check('ubicacion', 'La ubicacion es obligatoria').not().isEmpty(),
    check('ip', 'La direccion IP es obligatoria').not().isEmpty(),
    existeCampo('numero'),
    existeCampo('ip'),
    ValDeCampos
], agregarConcentrador);

router.delete('/:id', [
    check('id', 'El id de concentrador es obligatorio').isMongoId()
], eliminarConcentrador);

module.exports = router;