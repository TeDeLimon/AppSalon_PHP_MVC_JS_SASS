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
            value="<?php echo $fecha; ?>"
        />
    </div>
    </form>
</div>

<?php include_once __DIR__ . '/../templates/alertas.php'; ?>

<div id="citas-admin">
    <ul class="citas">
    <?php  
if(!empty($citas)) {
        $idCita = 0;
        $suma = 0;
        foreach($citas as $key => $cita) {
            if($idCita !== $cita->id) {
    ?>
        <li>
            <p>ID: <span><?php echo $cita->id; ?></span></p>
            <p>Hora: <span><?php echo $cita->hora; ?></span></p>
            <p>Cliente: <span><?php echo $cita->cliente; ?></span></p>
            <p>Email: <span><?php echo $cita->email; ?></span></p>
            <p>Teléfono: <span><?php echo $cita->telefono; ?></span></p>
        <h3>Servicios</h3>
    <?php
            $idCita = $cita->id;
            }
    ?>
            <p class="servicio"><span><?php echo $cita->servicio . " $" . $cita->precio; ?></span></p>
    <?php
        $suma +=intval($cita->precio);
        $actual = $citas[$key]->id;
        $proximo = $citas[$key+1]->id ?? 0;
            if(esUltimo($actual,$proximo)) { 
    ?>
            <p class="servicio precio">Total: <span><?php echo '$'.$suma; ?></span></p>
            <form action="/api/eliminar" method="POST">
                <input type="hidden" name="id" value="<?php echo $cita->id; ?>"/>
                <input type="submit" class="boton-eliminar" value="Eliminar cita"/>
            </form>
    <?php
            $suma = 0;
            }
    }
}
    ?>
    </ul>
</div>

<?php 
    $script = "<script src='build/js/buscador.js'></script>";
?>