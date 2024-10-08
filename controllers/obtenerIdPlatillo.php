<?php
include_once '../models/database.php';

// Nombre del platillo que deseas buscar (puede ser proporcionado desde la interfaz de usuario)
$nombrePlatillo = $_POST['nombrePlatillo'];

try {
    // Consulta SQL para obtener el ID del platillo por su nombre
    $sql = "SELECT id_platillo FROM Platillo WHERE nombre = :nombre";

    // Preparar la consulta
    $stmt = $db->prepare($sql);

    // Asignar el valor del nombre del platillo al parámetro de la consulta
    $stmt->bindParam(':nombre', $nombrePlatillo, PDO::PARAM_STR);

    // Ejecutar la consulta
    $stmt->execute();

    // Obtener el resultado de la consulta
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar si se encontró el platillo
    if ($row) {
        // ID del platillo encontrado
        $idPlatillo = $row["id_platillo"];
        // Devolver el ID del platillo como respuesta
        echo json_encode(['status' => 'success', 'idPlatillo' => $idPlatillo]);
    } else {
        // Si no se encontró el platillo, devolver un mensaje de error
        echo json_encode(['status' => 'error', 'message' => 'No se encontró ningún platillo con el nombre proporcionado.']);
    }

} catch (PDOException $e) {
    // Si hay un error en la consulta, devolver un mensaje de error
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
