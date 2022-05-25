const consultaDB = async (URL_API, con) => {
    //colocar try catch para manejar los errores asincronos
    let consulta = await fetch(URL_API+`api/concentradores?con=${con}`);
    let resultado = await consulta.json();
    console.log(resultado);

    return resultado;
}



const consultaConcentrador = async (URL_API,_id) => {
    const consulta = await fetch(URL_API+`api/concentradores/${_id}`);
    return (await consulta.json());
}

const agregarConcentrador = async (URL_API, fechaAlta, nroConcentrador, localidad, dirip, calle, altura, nroUsuMono, nroUsuTri, nroAl, observaciones) => {
    return await fetch(URL_API+'api/concentradores', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            fecha_alta: new Date(fechaAlta),
            numero: nroConcentrador,
            localidad: localidad,
            ip: dirip,
            calle: calle,
            altura: altura,
            nro_usuarios_mono: nroUsuMono,
            nro_usuarios_tri: nroUsuTri,
            nro_alumbrados: nroAl,
            observaciones: observaciones
        })
    });
}

const eliminarConcentrador = async (URL_API, _id, callback) => {
    let consulta = await fetch(URL_API+`api/concentradores/${_id}`, {
        method: 'DELETE'
    });

    let resultado = await consulta.json();

    if(resultado){
        console.log("dentro funcion eliminarConcentrador");
        //cargarTabla();
        callback();
    }
}

export {consultaDB, consultaConcentrador, agregarConcentrador, eliminarConcentrador};