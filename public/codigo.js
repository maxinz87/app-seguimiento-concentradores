
//const URL_API = 'http://192.168.0.56:3000/api/';
const URL_API = 'https://seg-concentradores.herokuapp.com/api/';
const contenedor_tabla = document.querySelector('tbody');
let data = '';

const formConcentrador = document.querySelector('form');

const fechaAlta = document.querySelector('#fechaAlta');
const nroConcentrador = document.querySelector('#nroConcentrador');
const localidad = document.querySelector('#localidad');
const dirip = document.querySelector('#dirIP');
const calle = document.querySelector('#calle');
const altura = document.querySelector('#altura');

//Provisoriamente la localidad está limitada a Rafaela
localidad.value = "Rafaela";
localidad.disabled = true;

const spanCargando = document.querySelector('#spanCargando');
const infoGuardar = document.querySelector('#infoGuardar');
const modalMasInfo = new bootstrap.Modal(document.getElementById('modalMasInfo'),{backdrop:'static'});

const modal_title = document.querySelector('.modal-title');
const spanNro = document.querySelector('#spanNro');
const spanIP = document.querySelector('#spanIP');
const spanUbi = document.querySelector('#spanUbi');
const spanFecha = document.querySelector('#spanFecha');



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
                <td>${concentrador.calle} ${concentrador.altura}, ${concentrador.localidad}</td>
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

on(document, 'click', '.btnMasInfo', async e => {
    const _id = e.target.parentNode.parentNode.children[0].getAttribute("_id")
    //const nroConcentrador = e.target.parentNode.parentNode.firstElementChild;
    //console.log(nroConcentrador.getAttribute("_id"));
    const consulta = await fetch(URL_API+`concentradores/${_id}`);

    const resultado = await consulta.json();

    const datos = resultado.data; 
    const fecha = new Date(datos.fecha_alta); //Se parsea la fecha a tipo válido


    modal_title.innerHTML = `Concentrador nro ${e.target.parentNode.parentNode.children[0].innerHTML}`;
    spanFecha.innerHTML = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getUTCFullYear()}`;
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
            fecha_alta: new Date(fechaAlta.value),
            numero: nroConcentrador.value,
            localidad: localidad.value,
            ip: dirip.value,
            calle: calle.value,
            altura: altura.value
        })
    });

    if(consulta.status === 200){
        fechaAlta.value = "";
        nroConcentrador.value = "",
        //localidad.value = "";
        dirip.value = "";
        calle.value= "";
        altura.value = "";
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