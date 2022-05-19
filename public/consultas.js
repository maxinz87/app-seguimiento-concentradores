const consultaDB = async (URL_API) => {
    //colocar try catch para manejar los errores asincronos
    let consulta = await fetch(URL_API+'api/concentradores');
    let resultado = await consulta.json();

    return resultado;
}



const consultaConcentrador = async (URL_API,_id) => {
    const consulta = await fetch(URL_API+`api/concentradores/${_id}`);
    return (await consulta.json());
}

const agregarConcentrador = async (URL_API, fechaAlta, nroConcentrador, localidad, dirip, calle, altura) => {
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
            altura: altura
        })
    });
}

export {consultaDB, consultaConcentrador, agregarConcentrador};