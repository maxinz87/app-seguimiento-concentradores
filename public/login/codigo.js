import {URL_API} from '../var.js';

//const URL_API = 'https://seg-concentradores.herokuapp.com/';
const usuario = document.querySelector('#usuario');
const pass = document.querySelector('#pass');
const formLogin = document.querySelector('form');
const msgInfo = document.querySelector('#msgInfo');

msgInfo.style.display = "none";

//código que realiza la petición POST al tratar de agregar un concentrador
formLogin.addEventListener('submit', async e => {
    e.preventDefault();

    const consulta = await fetch(URL_API+'login', {
        method: 'POST',
        credentials: 'include', //parametro importante para que el navegador guarde la cookie enviada por el servidor

        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario.value,
            pwd: pass.value
        })
    });



    if(consulta.status === 200){
        console.log("dentro del status 200");
        const datos = await consulta.json();
        console.log("despues de consulta.json()");
        const {usuario,_id} = datos.consulta_usuario;
        console.log(datos,datos.consulta_usuario);
        console.log("asignación datos a variables");
        await localStorage.setItem('usuario-app', JSON.stringify({"usuario":usuario,"id":_id}));
        console.log("asignacion a local storage");
        //document.cookie = `jwtvalid=${localStorage.getItem('sec-token')}`;
        location.assign(URL_API);

    }
    else {
        const mensaje = await consulta.json();
        msgInfo.innerHTML = mensaje.msg;
        msgInfo.style.display = "block";
        console.log("error en la peticion desde el frontend");
    }

});