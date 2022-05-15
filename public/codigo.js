const URL_API = 'https://seg-concentradores.herokuapp.com/api/';
const contenedor_tabla = document.querySelector('tbody');
let data = '';

const formConcentrador = document.querySelector('form');

const nroConcentrador = document.querySelector('#nroConcentrador');
const ubicacion = document.querySelector('#ubicacion');
const dirip = document.querySelector('#dirIP');
const spanCargando = document.querySelector('#spanCargando');



const consultaDB = async () => {
    //colocar try catch para manejar los errores asincronos
    let consulta = await fetch(URL_API+'concentradores');
    let resultado = await consulta.json();

    return resultado;
}

const eliminarConcentrador = async (_id) => {
    let consulta = await fetch(URL_API+`concentradores/${_id}`, {
        method: 'DELETE'
    });

    let resultado = await consulta.json();

    if(resultado){
        cargarTabla();
    }
}

const listarConcentradoresTabla = (datosConcentradores) => {

    data = '';

    datosConcentradores.data.forEach( concentrador => {

        data += `
            <tr>
                <td _id="${concentrador._id}">${concentrador.numero}</td>
                <td>${concentrador.ubicacion}</td>
                <td>${concentrador.ip}</td>
                <td class="text-center"><a class="btnBorrar btn btn-danger">X</a></td>
            </tr>
        `
        contenedor_tabla.innerHTML = data;
        
    });

}



const on = (elemento, evento, selector, controlador) => {

    elemento.addEventListener(evento, e => {
        if(e.target.closest(selector)){
            controlador(e);
        }
    })
}

on(document, 'click', '.btnBorrar', e => {
    const nroConcentrador = e.target.parentNode.parentNode.firstElementChild;
    console.log(nroConcentrador.getAttribute("_id"));

    alertify.confirm(`Está seguro de eliminar el concentrador ${nroConcentrador.innerHTML} de la base de datos?`,
     function(){
         eliminarConcentrador(nroConcentrador.getAttribute("_id"));
       alertify.success('concentrador eliminado');
     },
     function(){
       alertify.error('Cancelado');
     }).set({title:"Eliminar Concentrador?"}).set({labels:{ok:'SI', cancel: 'Cancelar'}});

});

const cargarTabla = async () => {
    spanCargando.style.display = "block";
    listarConcentradoresTabla(await consultaDB());
    spanCargando.style.display = "none";
}

btnGuardar.addEventListener('click', () => {
    console.log("funcion boton");
});

cargarTabla();


formConcentrador.addEventListener('submit', async e => {
    e.preventDefault();
    const consulta = await fetch(URL_API+'concentradores', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            numero: nroConcentrador.value,
            ubicacion: ubicacion.value,
            ip: dirip.value
        })
    });

    console.log(consulta.status);

    cargarTabla();


});