<?php
include_once '../models/database.php';

// Obtener los datos del formulario
$nombre = $_POST['nombre'];
$apellidoPaterno = $_POST['apellido_paterno'];
$apellidoMaterno = $_POST['apellido_materno'];
$telefono = $_POST['telefono'];
$correo = $_POST['correo'];
$contraseña = $_POST['contraseña'];

// Hashear la contraseña
$contraseñaHasheada = password_hash($contraseña, PASSWORD_BCRYPT);

try {
    // Verificar si el cliente ya existe en la base de datos
    $stmt_verificar = $db->prepare("SELECT COUNT(*) AS count FROM cliente WHERE correo = ?");
    $stmt_verificar->execute([$correo]);
    $row = $stmt_verificar->fetch(PDO::FETCH_ASSOC);

    if ($row['count'] > 0) {
        // Si el cliente ya existe, devolver un mensaje de error
        echo json_encode(['status' => 'error', 'message' => 'El cliente ya está registrado.']);
        exit();
    }

    // Si el cliente no existe, proceder con la inserción
    $stmt_insertar = $db->prepare("INSERT INTO cliente (nombre, apellido_paterno, apellido_materno, telefono, correo, contraseña) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt_insertar->execute([$nombre, $apellidoPaterno, $apellidoMaterno, $telefono, $correo, $contraseñaHasheada]);

    // Si se llega aquí, el registro fue exitoso
    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    // Si hay un error, devolver un mensaje de error
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
