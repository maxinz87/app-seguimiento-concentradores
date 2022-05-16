
const URL_API = 'https://seg-concentradores.herokuapp.com/api/';
const contenedor_tabla = document.querySelector('tbody');
let data = '';

const formConcentrador = document.querySelector('form');

const nroConcentrador = document.querySelector('#nroConcentrador');
const ubicacion = document.querySelector('#ubicacion');
const dirip = document.querySelector('#dirIP');
const spanCargando = document.querySelector('#spanCargando');
const infoGuardar = document.querySelector('#infoGuardar');
const modalMasInfo = new bootstrap.Modal(document.getElementById('modalMasInfo'),{backdrop:'static'});

const modal_title = document.querySelector('.modal-title');
const spanNro = document.querySelector('#spanNro');
const spanIP = document.querySelector('#spanIP');
const spanUbi = document.querySelector('#spanUbi');


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
//<a target="_blank" href="http://'+ip+'">'+ ip + '</a>'
        data += `
            <tr>
                <td _id="${concentrador._id}">${concentrador.numero}</td>
                <td>${concentrador.ubicacion}</td>
                <td><a class="valorIP" target="_blank" href="http://${concentrador.ip}">${concentrador.ip}</a></td>
                <td class="text-center"><a class="btnMasInfo btn btn-primary">+</a></td> 
                <td class="text-center"><a class="btnBorrar btn btn-danger">X</a></td>
            </tr>
        `
        contenedor_tabla.innerHTML = data;
        
    });

}


//emula a la funcion on de Jquery para trabajar con los botones dinamicos de btnBorrar
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

on(document, 'click', '.btnMasInfo', e => {
    //const nroConcentrador = e.target.parentNode.parentNode.firstElementChild;
    //console.log(nroConcentrador.getAttribute("_id"));

    modal_title.innerHTML = `Concentrador nro ${e.target.parentNode.parentNode.children[0].innerHTML}`
    spanNro.innerHTML = e.target.parentNode.parentNode.children[0].innerHTML;
    spanUbi.innerHTML = e.target.parentNode.parentNode.children[1].innerHTML;
    spanIP.innerHTML = e.target.parentNode.parentNode.children[2].innerHTML;
    modalMasInfo.show();

});

const cargarTabla = async () => {
    spanCargando.style.display = "block";
    listarConcentradoresTabla(await consultaDB());
    spanCargando.style.display = "none";
}






//código que realiza la petición POST al tratar de agregar un concentrador
formConcentrador.addEventListener('submit', async e => {
    e.preventDefault();
    const nroConcentradorTemp = nroConcentrador.value;
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

    if(consulta.status === 200){
        nroConcentrador.value = "",
        ubicacion.value = "";
        dirip.value = "";
        infoGuardar.innerHTML= `Se agregó el concentrador ${nroConcentradorTemp} a la base de datos`;
        infoGuardar.style.fontWeight="bold";
        infoGuardar.style.color="#01ED2D";
        infoGuardar.style.display="inline";
        setTimeout(()=>{
            infoGuardar.style.display="none";
        },3000);
    }
    else {
        let respuesta = await consulta.json();
        if(respuesta.errors instanceof Array){
            infoGuardar.innerHTML = respuesta.errors[0].msg;
        }else{
            infoGuardar.innerHTML = respuesta.msg;
        }
        console.log(respuesta);

        infoGuardar.style.fontWeight="bold";
        infoGuardar.style.color="orange";
        infoGuardar.style.display="inline";
        setTimeout(()=>{
            infoGuardar.style.display="none";
        },3000);
    }


    cargarTabla();


});



//se carga la tabla al abrir la web
cargarTabla();