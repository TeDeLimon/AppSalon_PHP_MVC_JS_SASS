<h1 class="nombre-pagina">Olvide Password</h1>
<p class="descripcion-pagina">Reestablece tu password escribiendo tu email a continuación</p>

<form class="formulario" method="POST" action="/olvide">
    <div class="campo">
        <label for="email">Email</label>
        <input 
            type="email" 
            id="email" 
            name="email"
            placeholder="Tu email"
        />
    </div>
    <input type="submit" value="Enviar intrucciones" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesión</a>
    <a href="/crear-cuenta">¿Aún no tienes una cuenta?</a>
</div>