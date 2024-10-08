<?php
include_once '../models/database.php';

// Obtener el ID del platillo desde la solicitud (puede ser proporcionado desde la interfaz de usuario)
$idPlatillo = $_GET['id_platillo'];

try {
    // Consulta SQL para obtener los nombres de los ingredientes del platillo
    $sql = "SELECT i.nombre 
            FROM Platillo_Detalle pd
            JOIN Ingrediente i ON pd.id_ingrediente = i.id_ingrediente
            WHERE pd.id_platillo = :id_platillo";
    
    // Preparar la consulta
    $stmt = $db->prepare($sql);
    
    // Asignar el valor del ID del platillo al parámetro de la consulta
    $stmt->bindParam(':id_platillo', $idPlatillo, PDO::PARAM_INT);
    
    // Ejecutar la consulta
    $stmt->execute();
    
    // Obtener todos los resultados de la consulta
    $ingredientes = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Devolver los nombres de los ingredientes como respuesta JSON
    echo json_encode(['status' => 'success', 'data' => $ingredientes]);
} catch (PDOException $e) {
    // Si hay un error en la consulta, devolver un mensaje de error
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
