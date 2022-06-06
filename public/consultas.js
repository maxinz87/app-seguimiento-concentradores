const consultaDB = async (URL_API, tipoBusqueda, termino, con, limite = 10) => { //con es a partir de qué concentrador se realiza la consulta
    //colocar try catch para manejar los errores asincronos
    let consulta = await fetch(URL_API+`api/concentradores/${tipoBusqueda}/${termino}?con=${con}&limite=${limite}`);
    let resultado = await consulta.json();

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

const actualizarConcentrador = async (URL_API, _id, parametros) => {
    
    
    return await fetch(URL_API+`api/concentradores/${_id}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(parametros)
    });
}

const eliminarConcentrador = async (URL_API, _id) => {
    let consulta = await fetch(URL_API+`api/concentradores/${_id}`, {
        method: 'DELETE'
    });

    let resultado = await consulta.json();

    if(resultado){
        return true;
    }
    else
        return false;
}

export {consultaDB, consultaConcentrador, agregarConcentrador, actualizarConcentrador, eliminarConcentrador};