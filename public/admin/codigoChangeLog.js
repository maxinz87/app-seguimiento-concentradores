const URL_API = 'https://seg-concentradores.herokuapp.com/';
const contenedorPrincipalLogs = document.querySelector('#contenedorPrincipalLogs');
const btnIngresar = document.querySelector('#btnIngresar');



//Usar userAgent para detectar el dispositivo por el que se está accediendo. ya con esto aplicar los estilos mediante javascript con classList o className
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Mobile|Opera Mini/i.test(navigator.userAgent) ) {
    document.body.classList.add("fondoMobile");
 }


const agregarLog = async (URL_API, descripcion) => {
    return await fetch(URL_API+'admin/regcambios', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            descripcion: descripcion
        })
    });
}

const crearDivLogs = (arregloObjLog) => {

    fragmento = document.createDocumentFragment(); //crea fragmento para luego agregar contenido y posteriormente pintarlo en la web
    
    console.log("dentro de la funcion crearDivLogs",arregloObjLog);
    for(let i=0; i < arregloObjLog.length; i++){
        let fecha = new Date(arregloObjLog[i].fecha); 

        const contenedor = document.createElement('div');
        const fechaContenido = document.createElement('span');
        fechaContenido.style.fontSize = "16px";
        fechaContenido.style.fontWeight = "bold";

        const descripcion = document.createElement('p');
        descripcion.style.whiteSpace = "pre-line";

        
        fechaContenido.innerHTML = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
        descripcion.innerHTML = arregloObjLog[i].descripcion;

        contenedor.appendChild(fechaContenido);
        contenedor.appendChild(descripcion);
        fragmento.appendChild(contenedor);
        }
        while (contenedorPrincipalLogs.firstChild) {
            contenedorPrincipalLogs.removeChild(contenedorPrincipalLogs.firstChild);
          }
        
        contenedorPrincipalLogs.appendChild(fragmento);
}

const consultaLogs = async(URL_API) => {
    const consulta = await fetch(URL_API+'admin/regcambios/logs')
    resultado = await consulta.json();
    return resultado.consultaLogs;
}

const pintarLogs = async () => {
    datos= await consultaLogs(URL_API);

    crearDivLogs(datos);
}

const clickAgregarLog = async () => {
    descripcion.value = descripcion.value.trim(); //elimina los espacios en blanco al principio y final de una cadena para no guardar caracteres innecesarios
    consulta = await agregarLog(URL_API,descripcion.value);

    if( consulta.status === 200){

        await pintarLogs();


    }
}

pintarLogs();

btnIngresar.addEventListener('click', clickAgregarLog);
