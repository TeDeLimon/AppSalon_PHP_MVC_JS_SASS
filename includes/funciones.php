<?php

function debuggear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

//Función para comprobar sí es diferente 
function esUltimo(string $actual, string $proximo) {
    if($actual != $proximo) return true;
    return false;
}

//Función que revisa que el usuario está loggeado
function isAuth(): void {
    if(!isset($_SESSION['login'])) header('Location: /');
}

function isAdmin(): void {
    if(!isset($_SESSION['admin'])) {
        header('Location: /');
    }
}