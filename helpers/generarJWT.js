const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '', rol = '') => {
    return new Promise((resolve, reject) => {

        const payload = {
            uid,
            rol
        }

        jwt.sign(payload, process.env.PK_JWT,{
            expiresIn: '12h'
        }, (err, token) => {

            if(err){
                console.log(err);
                reject('No pudo generarse el JWT');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generarJWT
}