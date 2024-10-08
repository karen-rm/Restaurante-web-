<?php
// Incluir archivo de conexión a la base de datos
include_once '../models/database.php';

// Verificar si se recibió el ID del ingrediente
if (isset($_POST['id'])) {
    // Obtener el ID del ingrediente desde la solicitud POST
    $id_ingrediente = $_POST['id'];

    try {
        // Preparar la consulta para obtener los datos del ingrediente
        $stmt = $db->prepare('SELECT i.nombre AS nombre_ingrediente, f.nombre AS nombre_familia, i.unidad, i.cantidad, i.costo_unidad
                              FROM Ingrediente AS i
                              INNER JOIN Familia_Ingrediente AS f ON i.id_familia = f.id_familia
                              WHERE i.id_ingrediente = ?');

        // Ejecutar la consulta con el ID del ingrediente como parámetro
        $stmt->execute([$id_ingrediente]);

        // Obtener el resultado de la consulta
        $ingrediente = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si se encontró el ingrediente
        if ($ingrediente) {
            // Devolver los datos del ingrediente en formato JSON
            echo json_encode($ingrediente);
        } else {
            // Si no se encontró el ingrediente, devolver un mensaje de error
            echo json_encode(['error' => 'El ingrediente no fue encontrado.']);
        }
    } catch (PDOException $e) {
        // Si ocurre un error en la consulta, devolver un mensaje de error
        echo json_encode(['error' => 'Error al obtener los datos del ingrediente.']);
    }
} else {
    // Si no se recibió el ID del ingrediente, devolver un mensaje de error
    echo json_encode(['error' => 'ID del ingrediente no proporcionado.']);
}
?>
