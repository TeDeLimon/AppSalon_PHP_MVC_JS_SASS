document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
}); 

function iniciarApp() {
    buscarPorFecha();
}

function buscarPorFecha() {
    const fechaInput = document.querySelector('#fecha'); 
    console.log(fechaInput);
    fechaInput.addEventListener('input', function(e) {
        const fechaSeleccionada = e.target.value;
        
        window.location = `?fecha=${fechaSeleccionada}`;
    });
}