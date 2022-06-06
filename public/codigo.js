import {consultaDB, consultaConcentrador, agregarConcentrador, eliminarConcentrador, actualizarConcentrador} from './consultas.js';
import {URL_API} from './var.js';

const contenedor_tabla = document.querySelector('tbody');
let data = '';

const txtTotalCon = document.querySelector('#txtTotalCon');
const txtUsuario = document.querySelector('#txtUsuario');
const btnCerrarSesion = document.querySelector('#btnCerrarSesion');

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

//Busqueda
const selectBusqueda = document.querySelector('#selectBusqueda');
const inputBusqueda = document.querySelector('#inputBusqueda');
const btnBuscar = document.querySelector('#btnBuscar');
const txtInfoBusquedaParam = document.querySelector('#txtInfoBusquedaParam');
const txtInfoBusqueda = document.querySelector('#txtInfoBusqueda');
const btnQuitFiltro = document.querySelector('#btnQuitFiltro');

const spanCargando = document.querySelector('#spanCargando');
const infoGuardar = document.querySelector('#infoGuardar');
const modalMasInfo = new bootstrap.Modal(document.getElementById('modalMasInfo'),{backdrop:'static'});
const modalRegCambios = new bootstrap.Modal(document.getElementById('modalRegCambios'),{backdrop:'static'});


const modal_title = document.querySelectorAll('.modal-title');
const spanNro = document.querySelector('#spanNro');
const spanIP = document.querySelector('#spanIP');
const spanUbi = document.querySelector('#spanUbi');
const spanFecha = document.querySelector('#spanFecha');
const spanUMono = document.querySelector('#spanUMono');
const spanUTri = document.querySelector('#spanUTri');
const spanNroAl = document.querySelector('#spanNroAl');
const spanObser = document.querySelector('#spanObser');
const spanUsuario = document.querySelector('#spanUsuario');
const btnModificar = document.querySelector('#btnModificar');

const inputModFecha = document.querySelector('#inputModFecha');
const inputModNroSerie = document.querySelector('#inputModNroSerie');
const inputModLocalidad = document.querySelector('#inputModLocalidad');
inputModLocalidad.disabled = true;
const inputModCalle = document.querySelector('#inputModCalle');
const inputModAltura = document.querySelector('#inputModAltura');
const inputModIp = document.querySelector('#inputModIp');
const inputModUMono = document.querySelector('#inputModUMono');
const inputModUTri = document.querySelector('#inputModUTri');
const inputModAl = document.querySelector('#inputModAl');
const inputModObser = document.querySelector('#inputModObser');
const inputMods = document.getElementsByClassName('inputMod');
//const spanMods = document.getElementsByClassName('spanMod');
const modalActualizarConcentrador = new bootstrap.Modal(document.getElementById('modalActualizarConcentrador'),{backdrop:'static'});

const btnCerrarModal = document.querySelectorAll('.btnCerrarModal');

const formActualizaConcentrador = document.querySelector('#formActualizaConcentrador');

const modal_body_RegCambios = document.querySelector('.modal-body-RegCambios');

const paginacion = document.querySelector('.pagination');

txtUsuario.innerHTML = txtUsuario.innerHTML + `${JSON.parse(localStorage.getItem('usuario-app')).usuario}`;

//Se inicializa variables de parametros de busqueda en API.
let tipoBusqueda = 'completo';
let termino = "full"; //la variable termino debe contener siempre un valor debido a que si contiene una cadena vacia, null o undefined se crea un conflicto con la ruta listarConcentrador

let totalConcentradores = 0;
let conXPag = 10; //cant Concentradores en tabla por pagina
let conPagActual = 0; //mro de pagina actual
let dataConcentradorMasInfo = "";
 
//se aplica un addEventListener a los botones cerrar del moodal +Info
btnCerrarModal.forEach( btnCerrar => {
    btnCerrar.addEventListener('click', () => {
        dataConcentradorMasInfo = "";
    });
});

btnCerrarSesion.addEventListener('click',()=>{
    let fecha = new Date(Date.now());
    fecha = fecha.toUTCString();
    console.log("dentro de btncerrarsesiion");
    document.cookie = `jwtvalido=;path=/;max-age=0`
    localStorage.removeItem('usuario-app');
    location.assign(URL_API+'login');
});

btnBuscar.addEventListener('click', async e => {

    console.log("conPagActual: ", conPagActual);
    if(selectBusqueda.value!=="" && inputBusqueda.value !== ""){
        tipoBusqueda = selectBusqueda.value;
        termino = inputBusqueda.value;
        await cargarTabla(selectBusqueda.value,inputBusqueda.value,0);
        await PaginacionTabla(totalConcentradores, conXPag);
        txtInfoBusquedaParam.innerHTML = selectBusqueda.options[selectBusqueda.selectedIndex].text + ' = ' + termino;
        txtInfoBusqueda.style.display = "inline";
    }
});

btnQuitFiltro.addEventListener('click', async e => {

    if(selectBusqueda.value!=="" && inputBusqueda.value !== "" && tipoBusqueda !== 'completo'){
        tipoBusqueda = 'completo';
        termino = 'full';
        await cargarTabla(tipoBusqueda,termino,0);
        await PaginacionTabla(totalConcentradores, conXPag);
        txtInfoBusquedaParam.innerHTML = "";
        txtInfoBusqueda.style.display = "none";
    }
});

btnModificar.addEventListener('click', () => {

    actualizaModalInputConcentrador();



    //spanFecha.style.display = "none";
    //inputModFecha.style.display = "block";


});

//funcion auxiliar que muestra los input y oculta los span, y viceversa, dependiendo del estado booleano que se le pase.
const actualizaModalInputConcentrador = async () => {

    modal_title[1].innerHTML = `Actualización nro. serie ${dataConcentradorMasInfo.data.numero}`;
    console.log(inputMods);
    for(let i = 0; i < inputMods.length; i++){
        console.log(inputMods[i]);
            inputMods[i].classList.add('inputModVisible');
            if(inputMods[i].name !== 'fecha_alta')
                inputMods[i].value = dataConcentradorMasInfo.data[inputMods[i].name];
            else{
                const fecha = new Date(dataConcentradorMasInfo.data[inputMods[i].name]);
                const fecha_parseadaISO = fecha.toISOString();
                const fecha_arreglo = fecha_parseadaISO.split('T');
                inputMods[i].value = fecha_arreglo[0];
                console.log("fecha parseada: ", fecha_parseadaISO);
            }

/*
        if(inputMods[i].id !== "inputModIp"){
            inputMods[i].value = spanMods[i].innerHTML;
        }else {
            let corte = spanMods[i].innerHTML.split(">");
            corte = corte[1].split('<');
            inputMods[i].value = corte[0];
        }
*/
        

    }
}

const actualizaConcentrador = async (_id, fechaAlta, localidad, dirip, calle, altura, nroUsuMono, nroUsuTri, nroAl, observ) => {
    const resultado = await actualizarConcentrador(URL_API, _id, fechaAlta, localidad, dirip, calle, altura, nroUsuMono, nroUsuTri, nroAl, observ);

    if(resultado.status === 200){
        return true;
    }
    else if(resultado.status === 400){
        const respuesta = await resultado.json();
        console.log("hubo un error en la actualizacion: ", respuesta);
        alertify.alert('Aviso',`Error: ${respuesta.msg}`).set('movable', false);
        return false;
    }
    else{
        console.log("error desconocido en la actualizacion: ", await resultado);
        return false;
    }

        
}

formActualizaConcentrador.addEventListener('submit', async e => {
    e.preventDefault();
    console.log("actualiza concentrador");

    //arreglo que evita sumar la IP en caso que sea la misma, para no causar conflicto con las validaciones del backend.
    let objDatosActualizar = new Object();
    let contador_actualizaciones = 0;
    const fecha_alta_date = new Date(dataConcentradorMasInfo.data.fecha_alta);
    const fecha_alta_parseada = {
        ano: fecha_alta_date.getUTCFullYear(),
        mes: (fecha_alta_date.getUTCMonth()+1)<10 ? `0${fecha_alta_date.getUTCMonth()+1}` : fecha_alta_date.getUTCMonth()+1,
        dia: (fecha_alta_date.getUTCDate()<10) ? `0${fecha_alta_date.getUTCDate()}` : fecha_alta_date.getUTCDate()
    };
    //Acá se deberia armar una cadena parseada en formato de alguna etiqueta para mostrar los valores que son alterados.
    let varActualizaciones = `<h6>Se actualizarán los siguientes datos:</h6>\n`;
    if(`${fecha_alta_parseada.ano}-${fecha_alta_parseada.mes}-${fecha_alta_parseada.dia}` !== inputModFecha.value){
        varActualizaciones += `<span><b>Fecha alta:</b> ${fecha_alta_date.getUTCFullYear()}-${fecha_alta_date.getUTCMonth()+1}-${fecha_alta_date.getUTCDate()} <b>-></b> ${inputModFecha.value}</span><br>`;
        contador_actualizaciones++;
        objDatosActualizar.fecha_alta = new Date(inputModFecha.value);
    }
    if(dataConcentradorMasInfo.data.localidad !== inputModLocalidad.value){
        varActualizaciones += `<span><b>Localidad:</b> ${dataConcentradorMasInfo.data.localidad} <b>-></b> ${inputModLocalidad.value}</span><br>`;
        contador_actualizaciones++;
        objDatosActualizar.localidad = inputModLocalidad.value;
    }
    if(dataConcentradorMasInfo.data.calle !== inputModCalle.value){
        varActualizaciones += `<span><b>Calle:</b> ${dataConcentradorMasInfo.data.calle} <b>-></b> ${inputModCalle.value}</span><br>`;
        contador_actualizaciones++;
        objDatosActualizar.calle = inputModCalle.value;
    }
    if(dataConcentradorMasInfo.data.altura !== inputModAltura.value){
        varActualizaciones += `<span><b>Altura:</b> ${dataConcentradorMasInfo.data.altura} <b>-></b> ${inputModAltura.value}</span><br>`;
        contador_actualizaciones++;
        objDatosActualizar.altura = inputModAltura.value;
    }
          
    
    if(dataConcentradorMasInfo.data.ip !== inputModIp.value){
        varActualizaciones += `<span><b>IP:</b> ${dataConcentradorMasInfo.data.ip} <b>-></b> ${inputModIp.value}</span><br>`;
        contador_actualizaciones++;
        objDatosActualizar.ip = inputModIp.value;

    }
    if(dataConcentradorMasInfo.data.nro_usuarios_mono !== Number(inputModUMono.value)){
        varActualizaciones += `<span><b>U. monofásicos:</b> ${dataConcentradorMasInfo.data.nro_usuarios_mono} <b>-></b> ${inputModUMono.value}</span><br>`;
        contador_actualizaciones++;
        objDatosActualizar.nro_usuarios_mono = inputModUMono.value;
    }
    if(dataConcentradorMasInfo.data.nro_usuarios_tri !== Number(inputModUTri.value)){
        varActualizaciones += `<span><b>U. trifásicos:</b> ${dataConcentradorMasInfo.data.nro_usuarios_tri} <b>-></b> ${inputModUTri.value}</span><br>`;    
        contador_actualizaciones++;
        objDatosActualizar.nro_usuarios_tri = inputModUTri.value;
    }
    if(dataConcentradorMasInfo.data.nro_alumbrados !== Number(inputModAl.value)){
        varActualizaciones += `<span><b>Alumbrados:</b> ${dataConcentradorMasInfo.data.nro_alumbrados} <b>-></b> ${inputModAl.value}</span><br>`;
        contador_actualizaciones++;
        objDatosActualizar.nro_alumbrados = inputModAl.value;
    }
    if(dataConcentradorMasInfo.data.observaciones !== inputModObser.value){
        varActualizaciones += `<span><b>Observaciones:</b> ${dataConcentradorMasInfo.data.observaciones} <b>-></b> ${inputModObser.value}</span>`;
        contador_actualizaciones++;
        objDatosActualizar.observaciones = inputModObser.value;
    }
           
        if(contador_actualizaciones>0){
            alertify.confirm(`<span></span>`,
            async function(){
                const resultado = await actualizaConcentrador(dataConcentradorMasInfo.data._id,
                    objDatosActualizar);

                    console.log("resultado! ",);
                    if(resultado){
                        modalActualizarConcentrador.hide();
                        await cargarTabla(tipoBusqueda,termino,0);
                        alertify.success('concentrador actualizado!');
                    }
            },
            function(){
              alertify.error('Cancelado');
            }).set({title:`Actualización Concentrador ${dataConcentradorMasInfo.data.numero}`}).set({labels:{ok:'SI', cancel: 'Cancelar'}}).set('closable', false).set('movable', false)
            .setContent(varActualizaciones);
        } else{
            alertify.alert('Aviso','Debe modificar algún parametro para actualizar la información').set('movable', false);
        }

})



const actualizaTotalConcentradores = (valor) => {
    totalConcentradores = valor;
    txtTotalCon.innerHTML = totalConcentradores;
}

const listarConcentradoresTabla = (datosConcentradores) => {

    data = '';
    actualizaTotalConcentradores(datosConcentradores.total);

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
     async function(){
         if(eliminarConcentrador(URL_API,nroConcentrador.getAttribute("_id")))
            await cargarTabla(tipoBusqueda,termino,0);
         
         actualizaTotalConcentradores(totalConcentradores-1);
         await PaginacionTabla(totalConcentradores, conXPag);
       alertify.success('concentrador eliminado');
     },
     function(){
       alertify.error('Cancelado');
     }).set({title:"Eliminar Concentrador?"}).set({labels:{ok:'SI', cancel: 'Cancelar'}}).set('closable', false).set('movable', false);

});

on(document, 'click', '.btnMasInfo', async e => {
    const _id = e.target.parentNode.parentNode.children[0].getAttribute("_id")
    //const nroConcentrador = e.target.parentNode.parentNode.firstElementChild;
    //console.log(nroConcentrador.getAttribute("_id"));

    dataConcentradorMasInfo = await consultaConcentrador(URL_API,_id);

    const datos = dataConcentradorMasInfo.data; 

    console.log(datos);

    const fecha = new Date(datos.fecha_alta); //Se parsea la fecha a tipo válido


    modal_title[0].innerHTML = `Concentrador nro ${e.target.parentNode.parentNode.children[0].innerHTML}`;
    spanUsuario.innerHTML = datos.usuario.usuario;
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




const cargarTabla = async (tipoBusqueda,termino,con) => {
    spanCargando.style.display = "block";
    listarConcentradoresTabla(await consultaDB(URL_API, tipoBusqueda, termino, con));
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

    await cargarTabla(tipoBusqueda, termino, 0); //carga la pagina del ultimo ingresado
    await PaginacionTabla(totalConcentradores, conXPag);


});

const PaginacionTabla = (total, regXPag) => {
    const paginas = Math.ceil(total/regXPag); //Nro de paginas dado el total de documentos dividido la canntidad de registros a mostrar por paginas. Math.ceil devuelve el entero mayor al nro decimal dado
    if(paginacion.length>paginas){
        paginacion.removeChild(paginacion.children(`pag${paginas}`));
    }
    const fragmento = document.createDocumentFragment();
    //generar paginas
    for(let i=0; i<paginas; i++){

        const li = document.createElement('LI');
        li.className = 'page-item';
        const enlace = document.createElement('A');
        enlace.className = 'page-link';
        enlace.innerHTML = i+1;
        enlace.id = `pag${i}`
        on(document,'click',`#pag${i}`, async e => {
            console.log("click en pagina: ",i);
            await cargarTabla(tipoBusqueda,termino,10*i);
            conPagActual = i;
        });

        li.appendChild(enlace);
        fragmento.appendChild(li);
    }
    paginacion.innerHTML = '';
    paginacion.appendChild(fragmento);

}

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



//-----------------------------------------------------------------------------------------------------------------------------------------
//const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'; //cadena con informacion para exportacin en formato .xlsx
const EXCEL_TYPE = 'application/vnd.oasis.opendocument.spreadsheet;charset=UTF-8';
const EXCEL_EXTENSION = '.ods';
const creaXLSX = async () => {

    const datoss = await consultaDB(URL_API, tipoBusqueda,termino,0,0);

    //Se parsea los objetos dentro de datoss para poder excluir y exportar los datos necesarios
    await datoss.data.forEach( documento => {
        if(documento.usuario){
            documento.usuario = documento.usuario.usuario;
        }
        //const fecha = new Date(documento.fecha_alta);
        //documento.fecha_alta = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getUTCFullYear()}`
        delete documento._id;
        delete documento.__v;
    });

    const encabezados_parseados = {fecha_alta:'Fecha alta', numero: 'Nro. concentrador', localidad: 'Localidad', calle: 'Calle', altura: 'Altura', nro_usuarios_mono: 'Nro. usuarios monofásicos', nro_usuarios_tri: 'Nro. usuarios trifásicos', nro_alumbrados: 'Nro. alumbrados', observaciones: 'Observaciones', ip: 'Dirección IP', usuario: 'Usuario'};
    const encabezados = Object.keys(encabezados_parseados); //arreglo de las claves del objeto encabezados_parseados
    const encabezados_tipos = {fecha_alta:'d',numero:'s',localidad:'s',calle:'s',altura:'s',nro_usuarios_mono:'n',nro_usuarios_tri:'n',nro_alumbrados:'n',observaciones:'s',ip:'s'}
    datoss.data.unshift(encabezados_parseados);

    const worksheet = XLSX.utils.json_to_sheet(datoss.data,{ skipHeader: true, });
            

            let range = XLSX.utils.decode_range(worksheet['!ref']);

            for(let R = 1; R <= range.e.r; ++R) {
                let contador = 0;
            for( const encabezado in encabezados_tipos) {
              let cell_address = {c:contador, r:R};
              contador++;
              /* if an A1-style address is needed, encode the address */
              let cell_ref = XLSX.utils.encode_cell(cell_address);
              // console.log(cell_ref); //muestra el nro de celda
          
              if(!worksheet[cell_ref]) continue;
            /* `.t == "n"` for number cells */
            //console.log("antes: ",worksheet[cell_ref]); //muestra el tipo con .t y el contenido de la celda con .v
            worksheet[cell_ref].t = encabezados_tipos[encabezado];
            //console.log(worksheet[cell_ref]);
            }
          }
          


    //['Fecha alta','Nro. concentrador','Localidad','Calle','Altura','Nro. usuarios monofásicos','Nro. usuarios trifásicos','Nro. alumbrados','Observaciones','Dirección IP']
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");

//    const workbook = {
//        Sheets:{
//            'data':worksheet
//        },
//        SheetNames:['data']
//    };

    const excelBuffer = XLSX.write(workbook,{bookType:'ods', type:'array'});

    descargaXLSX(excelBuffer,'reporte_'+tipoBusqueda+'_'+termino);
}

const descargaXLSX = (buffer, nombre_archivo)=>{
    const data = new Blob([buffer], {type: EXCEL_TYPE});
    saveAs(data, nombre_archivo+EXCEL_EXTENSION);
}

const btnDescargaLista = document.querySelector('#btnDescargaLista');

btnDescargaLista.addEventListener('click', async e => {
    await creaXLSX();
});
//------------------------------------------------------------------------------------------------------------------------------------------


//se carga la tabla al abrir la web
//cargarTabla(con);

await cargarTabla(tipoBusqueda,termino,conPagActual);
await PaginacionTabla(totalConcentradores, conXPag);