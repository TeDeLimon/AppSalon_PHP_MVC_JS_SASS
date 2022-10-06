<?php

namespace Controllers;
use MVC\Router;
use Classes\Email;
use Model\Usuario;

class LoginController {
    public static function login(Router $router) {
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarLogin();
            if(empty($alertas)) {
                $usuario = Usuario::where('email', $auth->email);
                if(!$usuario) {
                    $alertas = Usuario::setAlerta('error','El email no existe');
                } else {
                    if ($usuario->validarPasswordAndVerificado($auth->password)) {
                        //Autenticar el usuario
                        session_start();
                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre." ".$usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        //Redireccionamiento 
                        if($usuario->admin == 1) {
                            $_SESSION['admin'] = $usuario->admin ?? null;
                            header('Location: /admin');
                        } else header('Location: /cita');
                    }
                }
            }
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/login', [
            'alertas' => $alertas
        ]);

    }
    public static function logout() {
        $_SESSION = [];
        header('Location: /');
    }
    public static function olvide(Router $router) {
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarEmail();
            if(empty($alertas)) {
                $usuario = Usuario::where('email',$auth->email);
                if($usuario && $usuario->confirmado === "1") {
                    //Generar un token
                    $usuario->crearToken();
                    $usuario->guardar();
                    Usuario::setAlerta('exito','Revisa el email');
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();

                    //Enviar el email

                } else {
                    Usuario::setAlerta('error','El usuario no existe o no está confirmado');
                }
            }
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/olvide-password', [
            'alertas' => $alertas
        ]);
    }
    public static function recuperar(Router $router) {
        $alertas = [];
        $error = false;
        $token = s($_GET['token']); //recordar siempre sanitizar cualquier valor que pueda introducir el usuario
        //Buscar usuario por su token
        $usuario = Usuario::where('token', $token);
        if(empty($usuario)) {
            Usuario::setAlerta('error','Token no válido');
            $error = true;
        } 
        if($_SERVER['REQUEST_METHOD'] == "POST") {
            //Leer el nuevo password y guardarlo
            $password = new Usuario($_POST);
            $alertas = $password->validarPassword();
            if(empty($alertas)) {
                $usuario->password = $password->password;
                $usuario->hashPassword();
                $usuario->token = null;
                $resultado = $usuario->guardar();
                if($resultado) header('Location: /cita');
            }
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/recuperar', [
            'alertas' => $alertas,
            'error' => $error
        ]);
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
                    if($resultado) header("Location: /mensaje");
                }
            }
        }
        $router->render('auth/crear-cuenta', [
            'usuario' =>$usuario,
            'alertas' => $alertas
        ]);
    }

    public static function mensaje(Router $router) {
        $router->render('auth/mensaje', [
        ]);
    }

    public static function confirmar(Router $router) {
        $alertas = [];
        $token = s($_GET['token']);
        $usuario = new Usuario();
        $usuario = Usuario::where('token', $token);
        if(empty($usuario)) {
            //Mostrar mensaje de error
            Usuario::setAlerta('error','Token no Válido');
        } else {
            $usuario->confirmado = "1";
            $usuario->token = null;
            $usuario->guardar();
            Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas, 
        ]);
    }
}