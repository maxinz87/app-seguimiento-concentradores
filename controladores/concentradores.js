const Concentrador = require('../modelos/concentrador');

const listaTipoBusqueda = ['nroConcentrador','rangoFecha','observaciones','completo'];

const listarConcentradores = async (req, res) => {

    //paginacion
    const{con = 0, limite = 10} = req.query; //con es concentrador. desde qué concentrador comienza a mostrar los resultados;
    const { tipo, termino } = req.params;

    if(!listaTipoBusqueda.includes(tipo)){
        return res.status(400).json({
            ok: false,
            msg: 'el tipo de busqueda no existe'
        });
    }

    let total, data, msg = "";


    try {

        switch (tipo) {
            case 'completo':
                msg = 'busqueda completa';
                [total, data] = await Promise.all([
                    Concentrador.countDocuments(),
                    Concentrador.find()
                    .populate('usuario','usuario')
                    .skip(Number(con))
                    .limit(limite)
                    .sort({_id: 'desc'})
                ]);
            break;
    
            case 'nroConcentrador':
                    msg = 'Busqueda x nro. concentrador';
                    const regex = new RegExp( termino );
                    [total, data] = await Promise.all([
                    Concentrador.countDocuments({numero: regex}),
                    Concentrador.find({numero: regex})
                    .populate('usuario','usuario')
                    .skip(Number(con))
                    .limit(limite)
                    .sort({_id: 'desc'})
                ]);
            break;
    
            case 'rangoFecha':
                msg = 'Busqueda x rango fecha'
            break;
    
            case 'observaciones':
                msg = 'Busqueda x observaciones'
            break;
        
            default:
                res.status(500).json({
                    ok:false,
                    msg:'El parametro para la busqueda no ha sido ingresado'
                });
        }

        if(!data){
            return res.status(400).json({ok:false, msg:"No hay documentos en la coleccion Concentradores"});
        }

        res.status(200).json({
            ok: true,
            total,
            data,
            msg
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false, msg: "hubo un error durante el procesamiento de la consulta"});
    }
}

const listarConcentrador = async (req, res) => {

    const { id } = req.params;

    try {
        const data = await Concentrador.findById(id)
                                        .populate('usuario','usuario');

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

    console.log("id del usuario que agregó el concentrador: ", req.uid);

    if(data.nro_usuarios_mono)
        data.nro_usuarios_mono = Math.floor(data.nro_usuarios_mono);

    if(data.nro_usuarios_tri)
        data.nro_usuarios_tri = Math.floor(data.nro_usuarios_tri);

    if(data.nro_alumbrados)
        data.nro_alumbrados = Math.floor(data.nro_alumbrados);

    const concentrador = new Concentrador({
        usuario: req.uid,
        ...data
    });

    await concentrador.save();

    res.status(200).json({
        ok: true,
        msg: 'Agregar concentrador',
        data
    });
}

const actualizarConcentrador = async (req, res) => {

    const { id } = req.params;

    //se saca localidad provisoriamente hasta que se agreguen nuevas localidades
    const {_id, numero, localidad, ...info} = req.body;

    console.log("id: ", id);
    console.log("info: ", info);

    try {
        const concentrador = await Concentrador.findByIdAndUpdate(id, info, {new: true}); //1er parametro es el id a modificar. 2do parametro es la info que se modifica, 3er parametro devuelve el documento actualzado con la nueva info.

        res.status(200).json( {
            ok: true,
            msg: 'Concentrador actualizado de forma exitosa!',
            concentrador
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'hubo un error al actualizar el documento'
        });
    }
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
    });

}


module.exports = {
    agregarConcentrador,
    listarConcentradores,
    eliminarConcentrador,
    listarConcentrador,
    actualizarConcentrador
}