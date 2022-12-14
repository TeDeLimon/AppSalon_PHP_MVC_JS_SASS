<?php

namespace Controllers;

use MVC\Router;
use Model\Usuario;

class CitaController {
    public static function index(Router $router) {
        isAuth();
        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}
