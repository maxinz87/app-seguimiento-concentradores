import {consultaDB, consultaConcentrador, agregarConcentrador, eliminarConcentrador} from './consultas.js';



const URL_API = 'https://seg-concentradores.herokuapp.com/';
const contenedor_tabla = document.querySelector('tbody');
let data = '';

const formConcentrador = document.querySelector('form');

const fechaAlta = document.querySelector('#fechaAlta');
const nroConcentrador = document.querySelector('#nroConcentrador');
const localidad = document.querySelector('#localidad');
const dirip = document.querySelector('#dirIP');
const calle = document.querySelector('#calle');
const altura = document.querySelector('#altura');
const nroUsuMono = document.querySelector('#nroUsuMono');
const nroUsuTri = document.querySelector('#nroUsuTri');
const nroAl = document.querySelector('#nroAl');
const observaciones = document.querySelector('#observaciones');

//Provisoriamente la localidad está limitada a Rafaela
localidad.value = "Rafaela";
localidad.disabled = true;

const spanCargando = document.querySelector('#spanCargando');
const infoGuardar = document.querySelector('#infoGuardar');
const modalMasInfo = new bootstrap.Modal(document.getElementById('modalMasInfo'),{backdrop:'static'});
const modalRegCambios = new bootstrap.Modal(document.getElementById('modalRegCambios'),{backdrop:'static'});


const modal_title = document.querySelector('.modal-title');
const spanNro = document.querySelector('#spanNro');
const spanIP = document.querySelector('#spanIP');
const spanUbi = document.querySelector('#spanUbi');
const spanFecha = document.querySelector('#spanFecha');
const spanUMono = document.querySelector('#spanUMono');
const spanUTri = document.querySelector('#spanUTri');
const spanNroAl = document.querySelector('#spanNroAl');
const spanObser = document.querySelector('#spanObser');

const modal_body_RegCambios = document.querySelector('.modal-body-RegCambios');


const listarConcentradoresTabla = (datosConcentradores) => {

    data = '';

    if(datosConcentradores.data.length > 0){
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
    else
    contenedor_tabla.innerHTML = data;

}

/////////////////////////////////////////////////////


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
         eliminarConcentrador(URL_API,nroConcentrador.getAttribute("_id"),cargarTabla);
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

    const resultado = await consultaConcentrador(URL_API,_id);

    const datos = resultado.data; 
    const fecha = new Date(datos.fecha_alta); //Se parsea la fecha a tipo válido


    modal_title.innerHTML = `Concentrador nro ${e.target.parentNode.parentNode.children[0].innerHTML}`;
    spanFecha.innerHTML = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getUTCFullYear()}`;
    spanNro.innerHTML = e.target.parentNode.parentNode.children[0].innerHTML;
    spanUbi.innerHTML = e.target.parentNode.parentNode.children[1].innerHTML;
    spanIP.innerHTML = e.target.parentNode.parentNode.children[2].innerHTML;
    spanUMono.innerHTML = datos.nro_usuarios_mono;
    spanUTri.innerHTML = datos.nro_usuarios_tri;
    spanNroAl.innerHTML = datos.nro_alumbrados;
    spanTotal.innerHTML = parseInt(datos.nro_usuarios_mono) + parseInt(datos.nro_usuarios_tri) + parseInt(datos.nro_alumbrados);
    spanObser.innerHTML = datos.observaciones;
    modalMasInfo.show();

});



const consultaLogs = async(URL_API) => {
    const consulta = await fetch(URL_API+'admin/regcambios/logs')
    const resultado = await consulta.json();
    return resultado.consultaLogs;
}


const crearDivLogs = (arregloObjLog) => {

    const fragmento = document.createDocumentFragment(); //crea fragmento para luego agregar contenido y posteriormente pintarlo en la web
    
    console.log("dentro de la funcion crearDivLogs",arregloObjLog);
    for(let i=0; i < arregloObjLog.length; i++){
        let fecha = new Date(arregloObjLog[i].fecha); 

        const contenedor = document.createElement('div');
        const fechaContenido = document.createElement('span');
        fechaContenido.style.fontSize = "16px";
        fechaContenido.style.fontWeight = "bold";

        const descripcion = document.createElement('p');
        descripcion.style.whiteSpace = "pre-line";

        const separador = document.createElement('hr');

        
        fechaContenido.innerHTML = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
        descripcion.innerHTML = arregloObjLog[i].descripcion;

        contenedor.appendChild(fechaContenido);
        contenedor.appendChild(descripcion);
        contenedor.appendChild(separador);
        fragmento.appendChild(contenedor);
        }
        while (modal_body_RegCambios.firstChild) {
            modal_body_RegCambios.removeChild(modal_body_RegCambios.firstChild);
          }
        
        modal_body_RegCambios.appendChild(fragmento);
}

const pintarLogs = async () => {
    const datos= await consultaLogs(URL_API);

    crearDivLogs(datos);
}

on(document, 'click', '.btnRegCambios', async e => {

    await pintarLogs();
    modalRegCambios.show();

});




const cargarTabla = async () => {
    console.log("dentro de cargartabla");
    spanCargando.style.display = "block";
    listarConcentradoresTabla(await consultaDB(URL_API));
    spanCargando.style.display = "none";
}






//código que realiza la petición POST al tratar de agregar un concentrador
formConcentrador.addEventListener('submit', async e => {
    e.preventDefault();
    const nroConcentradorTemp = nroConcentrador.value;
    const consulta = await agregarConcentrador(URL_API, fechaAlta.value, nroConcentrador.value, localidad.value, dirip.value, calle.value, altura.value, nroUsuMono.value, nroUsuTri.value, nroAl.value, observaciones.value.trim());

    if(consulta.status === 200){
        fechaAlta.value = "";
        nroConcentrador.value = "",
        //localidad.value = "";
        dirip.value = "";
        calle.value= "";
        altura.value = "";
        nroUsuMono.value =  "";
        nroUsuTri.value = "";
        nroAl.value = "";
        observaciones.value = "";
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

const caracteresBloqueados = ['.','e','E','-',',','+']

const caracteresProhibidos = (evento) => {
        if (caracteresBloqueados.includes(evento.key)) {
          evento.preventDefault();
        }

}

nroUsuMono.addEventListener("keydown", caracteresProhibidos);
nroUsuTri.addEventListener("keydown", caracteresProhibidos);
nroAl.addEventListener("keydown", caracteresProhibidos);
nroConcentrador.addEventListener("keydown", caracteresProhibidos);



//se carga la tabla al abrir la web
cargarTabla();