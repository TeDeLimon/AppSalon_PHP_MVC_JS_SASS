<h1 class="nombre-pagina">Crear Cuenta</h1>
<p class="descripcion-pagina">Llena el siguiente formulario para crear una cuenta</p>

<?php include_once __DIR__ . '/../templates/alertas.php'; ?>

<form class="formulario" method="POST" action="/crear-cuenta">
    <div class="campo">
        <label for="nombre">Nombre</label>
        <input 
            type="text"
            name="nombre"
            id="nombre"
            placeholder="Tu nombre"
            value="<?php echo s($usuario->nombre); ?>"
        />
    </div>
    <div class="campo">
        <label for="apellido">Apellidos</label>
        <input 
            type="text"
            name="apellido"
            id="apellido"
            placeholder="Tus apellidos"
            value="<?php echo s($usuario->apellido); ?>"
        />
    </div>
    <div class="campo">
        <label for="telefono">Teléfono</label>
        <input 
            type="tel"
            name="telefono"
            id="telefono"
            placeholder="Tu teléfono"
            value="<?php echo s($usuario->telefono); ?>"
        />
    </div>
    <div class="campo">
        <label for="email">E-mail</label>
        <input 
            type="email"
            name="email"
            id="email"
            placeholder="Tu correo electrónico"
            value="<?php echo s($usuario->email); ?>"
        />
    </div>
    <div class="campo">
        <label for="password">Contraseña</label>
        <input 
            type="password"
            name="password"
            id="password"
            placeholder="Tu Contraseña"
        />
    </div>
    <input class="boton" type="submit" value="Crear Cuenta">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesión</a>
    <a href="/olvide">¿Olvidaste tu password?</a>
</div>