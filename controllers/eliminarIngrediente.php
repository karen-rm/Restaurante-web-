<?php
// Incluir el archivo que establece la conexión a la base de datos
include_once '../models/database.php';

// Inicializar la variable de respuesta
$response = array();

// Verificar si se recibió el ID del ingrediente
if (isset($_POST['id'])) {
    // Obtener el ID del ingrediente
    $id_ingrediente = $_POST['id'];

    try {
        // Preparar la consulta SQL para eliminar el ingrediente
        $stmt = $db->prepare("DELETE FROM Ingrediente WHERE id_ingrediente = ?");
        $stmt->execute([$id_ingrediente]);

        // Configurar la respuesta como éxito
        $response['status'] = 'success';
        $response['message'] = 'El ingrediente se ha eliminado correctamente.';
    } catch (PDOException $e) {
        // Si hubo una excepción, configurar la respuesta como error
        $response['status'] = 'error';
        $response['message'] = 'Error del servidor al eliminar el ingrediente. Intente nuevamente.';
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
