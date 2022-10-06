let paso = 1;
const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
};

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); //Muestra y oculta las secciones
    tabs(); //Cambiar la sección cuando se presionen los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador

    consultarAPI(); //Consulta la API en el backend

    nombreCliente(); //Añade el nombre del cliente al objeto de cita
    idCliente(); //Añade el id del cliente al objeto de cita
    seleccionarFecha(); //Añade la fecha de la cita en el objeto
    seleccionarHora(); //Añade la hora de la cita en el objeto
}
function tabs() {
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach(boton => {
        boton.addEventListener('click', function(e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
        });
    } );
}
function mostrarSeccion() {
    //Primero Ocular la sección que tenga la clase de mostrar
    if(paso === 3) mostrarResumen();
    const seccionAnterior = document.querySelector('.mostrar');
    seccionAnterior.classList.remove('mostrar');

    //Seleccionar la sección con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    tabAnterior.classList.remove('actual');
    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}
function botonesPaginador() {
    const anterior = document.querySelector('#anterior');
    const siguiente = document.querySelector('#siguiente');
    anterior.addEventListener('click',function() {
        if(paso == 1) paso = 3;
        else paso--;
        mostrarSeccion();
    });
    siguiente.addEventListener('click',function() {
        if(paso == 3) paso = 1;
        else paso++
        mostrarSeccion();
    });
}
/*function botonesPaginador2() {
    const anterior = document.querySelector('#anterior');
    const siguiente = document.querySelector('#siguiente');
    anterior.addEventListener('click', function () {
        paso--;
        console.log(paso);
        mostrarSeccion();
    });
    siguiente.addEventListener('click', function () {
        paso++;
        console.log(paso);
        mostrarSeccion();
    });
    if(paso === 1) {
        anterior.classList.add('ocultar');
        siguiente.classList.remove('ocultar');
    } else if(paso === 3) {
        anterior.classList.remove('ocultar');
        siguiente.classList.add('ocultar');
    } else {
        siguiente.classList.remove('ocultar');
        anterior.classList.remove('ocultar');
    }
}*/
async function consultarAPI() { //Dado que no sabemos el tiempo que demora la consulta debemos usar una función asíncrona
    try {
        const url = 'http://localhost:300/api/servicios';
        const resultado = await fetch(url); //Esperamos el resultado
        const servicios = await resultado.json();
        await mostrarServicios(servicios);

    } catch(error) {
        console.log(error);
    }
}
async function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const{ id, nombre, precio } = servicio;
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() { //Hacemos uso de un callback que es una respuesta a un evento
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    })
}
function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`)

    //Comprobar sí un servicio ya fue agregado y quitarlo
    if(servicios.some( agregado => agregado.id === id)) { //devuelve true o false en caso de que un servicio ya exista en el arreglo
        //Sí devuelve true significa que ya estaba arreglado, lo eliminamos
        cita.servicios = servicios.filter( agregado => agregado.id !== id)//Nos va a permitir sacar un elemento de un array
        divServicio.classList.remove('seleccionado');
    } else {
        //Si devuelve false significa que no estaba en el array
        cita.servicios = [...servicios, servicio]; //Toma una copia de los servicios y le agrego el nuevo servicio
        divServicio.classList.add('seleccionado');
    }
    console.log(cita);
}
function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}
function idCliente() {
    cita.id = document.querySelector('#id').value;
}
function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function (e) {
        const dia = new Date(e.target.value).getUTCDay();
        if ([6,0].includes(dia)) { //Includes recorre un array comprobando sí un valor está contenido
            mostrarAlerta('Fines de semana no trabajamos','error','.formulario');
            e.target.value = '';
        } else cita.fecha = e.target.value;
    });
}
function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function (e) {
        const horaCita = e.target.value; 
        const hora = horaCita.split(":")[0];
        if(hora < 10 || hora > 18) {
            mostrarAlerta('La hora no es válida','error','.formulario');
            e.target.value = '';
        }
        else cita.hora = e.target.value;
    })
}
function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    //Previene que se generen más de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) alertaPrevia.remove();

    //Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);
    
    if(desaparece) {
        setTimeout( () => { //vamos a eliminar el div después de 3 segundos
            alerta.remove();
        }, 3000);
    }
}
function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    //Limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Hacen falta datos o Servicios','error','.contenido-resumen',false);
        return;
    }
    //Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    //Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    servicios.forEach( servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    //Heading para Servicios en Resumen
    const headingUsuario = document.createElement('H3');
    headingUsuario.textContent = 'Resumen de Usuario';
    resumen.appendChild(headingUsuario);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre: </span> ${nombre}`;

    //Formatea la fecha de forma más amigable para el usuario
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth(); //Devuelve el número del mes del 0 al 11
    const dia = fechaObj.getDate(); //Devuelve el día del mes del 0 al 30 o 29
    const year = fechaObj.getUTCFullYear();
    const fechaUTC = new Date(Date.UTC(year, mes, dia));
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaUTC.toLocaleDateString('es-ES', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span> ${fechaFormateada}`;
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span> ${hora} Horas`;

    //Botón para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}
async function reservarCita() {

    const {  nombre, id, fecha, hora, servicios } = cita;

    const idServicios = servicios.map(servicio => servicio.id); //Map las coincidencias las va a ir colocando en la variable
    
    const datos = new FormData();
    datos.append('fecha',fecha);
    datos.append('hora',hora);
    datos.append('usuarioId',id);
    datos.append('servicios',idServicios);
    // console.log([...datos]);

    //Petición hacia la API
    try {
        const url = 'http://localhost:300/api/citas';

        const respuesta = await fetch(url, { 
            method: 'POST',
            body: datos
        }); //Hacemos el fetch hacia la url y debemos añadir el metodo POST como atributos
        const resultado = await respuesta.json();
        if(resultado.resultado) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se ha creado la cita',
                showConfirmButton: false,
                timer: 2500
            }).then( () => {
                window.location.reload();
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al guardar la cita'
        });
    }  
}