<?php

namespace Controllers;
use MVC\Router;
use Classes\Email;
use Model\Usuario;

class LoginController {
    public static function login(Router $router) {
        
        $router->render('auth/login', [

        ]);

    }
    public static function logout() {
        echo "Desde logout";
    }
    public static function olvide(Router $router) {
        $router->render('auth/olvide-password', [

        ]);
    }
    public static function recuperar() {
        echo "Desde recuperar";
    }
    public static function crear(Router $router) {
        $usuario = new Usuario();
        $alertas = []; //alertas vacías
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $usuario->sincronizar($_POST); //Sincroniza con los datos del POST
            $alertas = $usuario->validarNuevaCuenta(); 
            //Revisar que alertas esté vacío
            if(empty($alertas)) {
                //Verificar que el usuario no esté registrado
                $resultado = $usuario->existeUsuario();
                if($resultado->num_rows) {
                    $alertas = Usuario::getAlertas();
                } else { //No está registrado
                    //Hashear el password
                    $usuario->hashPassword();
                    //Genera un Token único
                    $usuario->crearToken();
                    //Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarConfirmacion();

                    $resultado = $usuario->guardar();
                    if($resultado) echo "Guardado correctamente";
                }
            }
        }
        $router->render('auth/crear-cuenta', [
            'usuario' =>$usuario,
            'alertas' => $alertas
        ]);
    }

}