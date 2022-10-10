<?php

namespace Controllers;

use MVC\Router;
use Model\AdminCita;

class AdminController {
    public static function index(Router $router) {
        isAdmin();
        $alertas = [];
        $fecha = $_GET['fecha'] ?? date('Y-m-d');
        $date = explode('-', $fecha);
        if (in_array(date('D', strtotime($fecha)),['Sat','Sun']) == 1) {
            AdminCita::setAlerta('error','Es sábado o Domingo');
        } else if (checkdate($date[1], $date[2], $date[0])) {
            //Consultar la base de datos
            $consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
            $consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
            $consulta .= " FROM citas  ";
            $consulta .= " LEFT OUTER JOIN usuarios ";
            $consulta .= " ON citas.usuarioId=usuarios.id  ";
            $consulta .= " LEFT OUTER JOIN citasServicios ";
            $consulta .= " ON citasServicios.citaId=citas.id ";
            $consulta .= " LEFT OUTER JOIN servicios ";
            $consulta .= " ON servicios.id=citasServicios.servicioId ";
            $consulta .= " WHERE fecha =  '${fecha}' ";
            $citas = AdminCita::SQL($consulta);
            if(empty($citas)) AdminCita::setAlerta('error','No hay citas para este día');
        } else {
            AdminCita::setAlerta('error','La fecha indicada no existe');
        }
        $alertas = AdminCita::getAlertas();
        $router->render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas ?? '',
            'fecha' => $fecha,
            'alertas' => $alertas
        ]);
    }
}