const  path = require('path');

const webPrincipal = (req, res) => {
    res.sendFile(path.join(__dirname,'../public','index.html'));
}

module.exports = {
    webPrincipal
}