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

const eliminarConcentrador = async (req, res) => {

    const { id } = req.params;

    const data = await Concentrador.findByIdAndDelete(id);

    console.log(data);

    if(!data){
        return res.status(400).json({
            ok:false,
            msg: 'No existe el nro de concentrador a eliminar'})
    }


    res.status(200).json({
        ok: true,
        msg: `Se eliminó el concentrador nro ${data.numero}`
    })
}

module.exports = {
    agregarConcentrador,
    listarConcentradores,
    eliminarConcentrador
}