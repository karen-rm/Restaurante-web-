<?php
// Incluir el archivo que establece la conexión a la base de datos
include_once '../models/database.php';

// Verificar si se recibió el ID del ingrediente
if (isset($_POST['id'])) {
    // Obtener el ID del ingrediente
    $id_ingrediente = $_POST['id'];

    try {
        // Preparar la consulta para obtener el nombre del ingrediente
        $stmt = $db->prepare("SELECT nombre FROM Ingrediente WHERE id_ingrediente = ?");
        $stmt->execute([$id_ingrediente]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si se encontró el ingrediente
        if ($result) {
            // Obtener el nombre del ingrediente
            $nombre_ingrediente = $result['nombre'];

            // Configurar la respuesta como éxito y enviar el nombre del ingrediente
            $response['status'] = 'success';
            $response['nombre'] = $nombre_ingrediente;
        } else {
            // Si no se encontró el ingrediente, configurar la respuesta como error
            $response['status'] = 'error';
            $response['message'] = 'No se encontró el ingrediente.';
        }
    } catch (PDOException $e) {
        // Si hubo una excepción, configurar la respuesta como error
        $response['status'] = 'error';
        $response['message'] = 'Error del servidor. Intente nuevamente.';
        // Opcionalmente, podríamos agregar información adicional sobre el error
        // $response['error_message'] = $e->getMessage();
    }
} else {
    // Si no se recibió el ID del ingrediente, configurar la respuesta como error
    $response['status'] = 'error';
    $response['message'] = 'No se recibió el ID del ingrediente.';
}

// Devolver la respuesta como JSON
echo json_encode($response);
?>
