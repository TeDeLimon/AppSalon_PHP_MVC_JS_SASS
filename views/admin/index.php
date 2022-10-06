<?php include_once __DIR__ . '/../templates/barra.php'; ?>

<h1 class="nombre-pagina">Panel de Administración</h1>

<h2>Buscar Citas</h2>
<div class="busqueda">
    <form class="formulario" method="post" action="/">
    <div class="campo">
        <label for="fecha">Fecha</label>
        <input 
            type="date" 
            name="fecha" 
            id="fecha"
        />
    </div>
    </form>
</div>

<div id="citas-admin">
    <ul class="citas">
    <?php  
        foreach($citas as $cita) {
    ?>
        <li>
            <p>ID: <span><?php echo $cita->id; ?></span></p>
        </li>
        <li>
            <p>Hora: <span><?php echo $cita->hora; ?></span></p>
        </li>
        <li>
            <p>Cliente: <span><?php echo $cita->cliente; ?></span></p>
        </li>
        <li>
            <p>Email: <span><?php echo $cita->email; ?></span></p>
        </li>
        <li>
            <p>Teléfono: <span><?php echo $cita->telefono; ?></span></p>
        </li>
        <li>
            <p>Servicio: <span><?php echo $cita->servicio; ?></span></p>
        </li>
        <li>
            <p>Precio: <span><?php echo $cita->precio; ?></span></p>
        </li>
    <?php
        }
    ?>
    </ul>
    
</div>