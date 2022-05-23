const URL_API = 'https://seg-concentradores.herokuapp.com/';
const usuario = document.querySelector('#usuario');
const pass = document.querySelector('#pass');
const formLogin = document.querySelector('form');

//código que realiza la petición POST al tratar de agregar un concentrador
formLogin.addEventListener('submit', async e => {
    e.preventDefault();

    const consulta = await fetch(URL_API+'login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario.value,
            pwd: pass.value
        })
    });



    if(consulta.status === 200){
        const datos = await consulta.json();
        const {usuario,_id} = datos.consulta_usuario;
        localStorage.setItem('usuario-app', JSON.stringify({"usuario":usuario,"id":_id}));

        //document.cookie = `jwtvalid=${localStorage.getItem('sec-token')}`;
        location.assign(URL_API);

    }
    else {
        console.log("error en la peticion desde el frontend");
    }

});