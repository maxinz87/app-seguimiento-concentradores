const {Router} = require('express');
const { agregarConcentrador,
        listarConcentradores,
        eliminarConcentrador } = require('../controladores/concentradores');
const Concentrador = require('../modelos/concentrador');

const router = Router();

router.get('/', listarConcentradores);

router.post('/', agregarConcentrador);

router.delete('/', eliminarConcentrador);

module.exports = router;