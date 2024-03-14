<?php
// Conexión a la base de datos (ejemplo básico)
$conn = new mysqli("localhost", "root", "", "ejemplo");

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Recibir datos del formulario
$username = $_POST['username'];
$password = $_POST['password'];

// Sentencia preparada para evitar inyección de SQL
$query = "SELECT * FROM usuarios WHERE username=? AND password=?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si se encontró algún usuario
if ($result->num_rows > 0) {
    echo "Inicio de sesión exitoso!";
} else {
    echo "Credenciales incorrectas.";
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
