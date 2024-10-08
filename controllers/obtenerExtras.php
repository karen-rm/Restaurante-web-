<?php
include_once '../models/database.php'; // Asegúrate de tener una conexión a la base de datos

if (isset($_GET['id_platillo'])) {
    $id_platillo = $_GET['id_platillo'];
    
    try {
        // Preparar la consulta SQL
        $sql = "SELECT * FROM Platillo_Extras WHERE id_platillo = ?";
        $stmt = $db->prepare($sql);
        
        // Asignar parámetros y ejecutar la consulta
        $stmt->execute([$id_platillo]);
        
        // Obtener resultados
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar si se obtuvieron resultados
        if ($result) {
            // Devolver la respuesta JSON con los extras
            echo json_encode(['status' => 'success', 'data' => $result]);
        } else {
            // Si no se encontraron extras para el platillo dado
            echo json_encode(['status' => 'success', 'data' => []]);
        }
    } catch (PDOException $e) {
        // Manejar cualquier error en la consulta
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    // Si no se proporcionó el ID del platillo
    echo json_encode(['status' => 'error', 'message' => 'ID de platillo no proporcionado']);
}
?>
