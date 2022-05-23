const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next) => {
    const cookie = req.cookies;

    if(!cookie.jwtvalido){
        //redirige a la web login
        return res.redirect('/login');
        //return res.status(401).json({ok:false,msg:'no hay token en la peticion'});
    }

    try {
        
        const { uid } = jwt.verify(cookie.jwtvalido, process.env.PK_JWT);

        req.uid = uid;


        next();
    } catch (error) {
        console.log(error);
        //redirige a la web login
        res.redirect('/login');
        //res.status(401).json({msg:'token no válido'});
        
    }

    
}

module.exports = {
    validarJWT
}