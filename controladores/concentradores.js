const Concentrador = require('../modelos/concentrador');

const listarConcentradores = async (req, res) => {

    try {
        const data = await Concentrador.find().sort({_id: 'desc'});

        console.log(data);

        if(!data){
            return res.status(400).json({ok:false, msg:"No hay documentos en la coleccion Concentradores"});
        }

        res.status(200).json({
            ok: true,
            data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false, msg: "hubo un error durante el procesamiento de la consulta"});
    }
}

const listarConcentrador = async (req, res) => {

    const { id } = req.params;

    try {
        const data = await Concentrador.findById(id);

        if(!data){
            return res.status(400).json({ok:false, msg:"el documento no existe en la coleccion Concentradores"});
        }

        res.status(200).json({
            ok: true,
            data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false, msg: "hubo un error durante el procesamiento de la consulta listarConcentrador"});
    }
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
    eliminarConcentrador,
    listarConcentrador
}