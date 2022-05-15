const URL_API = 'https://seg-concentradores.herokuapp.com/api/';
const contenedor_tabla = document.querySelector('tbody');
let data = '';

const formConcentrador = document.querySelector('form');

const nroConcentrador = document.querySelector('#nroConcentrador');
const ubicacion = document.querySelector('#ubicacion');
const dirip = document.querySelector('#dirIP');



const consultaDB = async () => {
    let consulta = await fetch(URL_API+'concentradores');
    let resultado = await consulta.json();
    console.log(resultado);
}

btnGuardar.addEventListener('click', consultaDB);