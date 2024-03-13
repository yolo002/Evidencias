<?php
// Conexión a la base de datos (ejemplo usando MySQLi)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "usuariosdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

// Obtener datos del formulario (sin sanear los datos)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Consulta vulnerable a inyección SQL
    $query = "SELECT * FROM usuarios WHERE username='$username' AND password='$password'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        echo "Inicio de sesión exitoso";
        // Aquí puedes redirigir a otra página si el inicio de sesión es exitoso
    } else {
        echo "Nombre de usuario o contraseña incorrectos";
    }
}

$conn->close();
?>
