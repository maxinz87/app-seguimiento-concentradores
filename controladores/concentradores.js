const Concentrador = require('../modelos/concentrador');

const listarConcentradores = (req, res) => {
    res.status(200).json({
        ok: true,
        msg: 'listarConcetradores'
    })
}

const agregarConcentrador = async (req, res) => {

    const data = req.body;

    const concentrador = new Concentrador(data);

    await concentrador.save();

    res.status(200).json({
        ok: true,
        msg: 'Agregar concentrador',
        data
    });
}

const eliminarConcentrador = (req, res) => {
    res.status(200).json({
        ok: true,
        msg: 'Eliminar concentrador'
    })
}

module.exports = {
    agregarConcentrador,
    listarConcentradores,
    eliminarConcentrador
}