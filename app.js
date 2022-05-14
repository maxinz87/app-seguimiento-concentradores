const express = require('express')
const app = express()
require('dotenv').config();

const port = process.env.PORT;


app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/404.html')
});

app.listen(port, () => {
    console.log(`servidor Node activo desde el puerto ${port}`);
});