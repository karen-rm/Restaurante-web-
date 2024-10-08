<?php
include_once '../models/database.php';

// Definimos un array para almacenar la respuesta
$response = array('status' => 'error', 'message' => 'Error desconocido');

// Verificamos si se ha enviado el formulario de inicio de sesión
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificamos si se han enviado los campos de usuario y contraseña
    if (isset($_POST['correo']) && isset($_POST['contraseña'])) {
        // Obtenemos los valores de usuario (correo) y contraseña desde el formulario
        $correo = $_POST['correo'];
        $contraseña = $_POST['contraseña'];

        // Debug: Muestra los valores recibidos
        // Estos valores se deben eliminar en producción para evitar problemas de seguridad
        error_log("Correo: " . $correo);
        error_log("Contraseña: " . $contraseña);

        try {
            // Preparamos la consulta SQL para verificar las credenciales del cliente
            $stmt = $db->prepare("SELECT correo, contraseña FROM cliente WHERE correo = ?");
            // Ejecutamos la consulta con el parámetro del correo
            $stmt->execute([$correo]);
            // Obtenemos el resultado de la consulta
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            // Debug: Muestra el resultado de la consulta
            // Este valor se debe eliminar en producción para evitar problemas de seguridad
            error_log("Resultado: " . print_r($result, true));

            // Verificamos si se encontró un cliente con el correo proporcionado
            if ($result && password_verify($contraseña, $result['contraseña'])) {
                // Si se encontró y la contraseña es correcta, configuramos la respuesta como éxito
                $response['status'] = 'success';
                unset($response['message']); // No necesitamos un mensaje de error en caso de éxito
            } else {
                // Si no se encontró o la contraseña es incorrecta, configuramos la respuesta como error
                $response['message'] = 'Usuario o contraseña incorrectos.';
            }
        } catch (PDOException $e) {
            // Si hubo una excepción, configuramos la respuesta como error
            $response['message'] = 'Error del servidor. Intente nuevamente.';
            // Opcionalmente, podríamos agregar información adicional sobre el error
            error_log("Error: " . $e->getMessage());
        }
    } else {
        // Si no se han enviado los campos requeridos, configuramos la respuesta como error
        $response['message'] = 'Campos incompletos.';
    }
} else {
    // Si no se ha enviado el formulario, configuramos la respuesta como error
    $response['message'] = 'Método no permitido.';
}

// Devolvemos la respuesta en formato JSON
echo json_encode($response);
?>
