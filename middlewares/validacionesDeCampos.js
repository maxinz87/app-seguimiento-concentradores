const { validationResult } = require("express-validator");
const Concentrador = require("../modelos/concentrador");

const ValDeCampos = (req, res, next) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return  res.status(400).json(errores);
    }

    next();
}

const existeCampo = (campo) => {

    return async ( req, res, next ) => {
    if(req.body[campo] && campo === 'numero'){


        try {
            const existeCampo = await Concentrador.findOne({numero: req.body[campo]});
        
            if(existeCampo){
                return res.status(400).json({
                    ok: false,
                    msg: `El numero de concentrador ya existe en la base de datos`
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ok:false, msg: 'Ocurrió un error al leer la base de datos'});
        }
        
        } else if(req.body[campo] && campo === 'ip'){
            try {
                const existeCampo = await Concentrador.findOne({ip: req.body[campo]});
            
                if(existeCampo){
                    return res.status(400).json({
                        ok: false,
                        msg: `la IP ya existe en la base de datos`
                    });
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json({ok:false, msg: 'Ocurrió un error al leer la base de datos'});
            }
        
    
        }

        next();
    }


}

//const existeConcentrador = async ( req, res, next ) => {
//
//    const existeConcentrador = await Concentrador.findOne({numero: req.body.numero});
//
//    if(existeConcentrador){
//        return res.status(400).json({
//            ok: false,
//            msg: "El concentrador ya existe en la base de datos"
//        });
//    }
//
//    next();
//}

module.exports = {
    ValDeCampos,
    existeCampo
}