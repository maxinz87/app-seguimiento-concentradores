const  path = require('path');
const Regcambio = require('../modelos/regcambio');

const webRegCambios = (req, res) => {
    res.sendFile(path.join(__dirname,'../public/webs','changelog.html'));
}

const agregarLog = async (req, res) => {

    datos = req.body;

    const regCambio = new Regcambio(datos);

    await regCambio.save();

    res.status(200).json({
        ok: true,
        msg: 'Agregar Log',
        datos
    });



}

const consultarLogs = async (req, res) => {

    try{
        const consultaLogs = await Regcambio.find().sort({_id: 'desc'});

        if(!consultaLogs){
            return res.status(400).json({
                ok:false,
                msg: 'No hay datos para mostrar'
            });
        }
    
        res.status(200).json({
            ok: true,
            consultaLogs
        });
    }
    catch(error){
        console.log(error);
    }

}

module.exports = {
    webRegCambios,
    agregarLog,
    consultarLogs
}