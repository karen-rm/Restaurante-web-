<?php

/*include_once '../models/Login.class.php';
include_once '../models/database.php'; 

// Definimos un array para almacenar la respuesta
$response = array();

// Verificamos si se ha enviado el formulario de inicio de sesión
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificamos si se han enviado los campos de usuario y contraseña
    if (isset($_POST['usuario']) && isset($_POST['contraseña'])) {
        // Obtenemos los valores de usuario y contraseña desde el formulario
        $usuario = $_POST['usuario'];
        $contraseña = $_POST['contraseña'];

        try {
            // Creamos un objeto Login con los datos del formulario
            $login = new Login($usuario, $contraseña);

            // Preparamos la consulta SQL para verificar las credenciales del usuario
            $stmt = $db->prepare("SELECT usuario, contraseña FROM administrador WHERE usuario = ? AND contraseña = ?");
            
            // Ejecutamos la consulta con los parámetros
            $stmt->execute([$usuario, $contraseña]);

            // Obtenemos el resultado de la consulta
            $result = $stmt->fetch();

            // Verificamos si se encontró un usuario con las credenciales proporcionadas
            if ($result) {
                // Si se encontró, configuramos la respuesta como éxito
                $response['status'] = 'success';
            } else {
                // Si no se encontró, configuramos la respuesta como error
                $response['status'] = 'error';
                $response['message'] = 'Usuario o contraseña incorrectos.';
            }
        } catch (PDOException $e) {
            // Si hubo una excepción, configuramos la respuesta como error
            $response['status'] = 'error';
            $response['message'] = 'Error del servidor. Intente nuevamente.';
            // Opcionalmente, podríamos agregar información adicional sobre el error
            // $response['error_message'] = $e->getMessage();
        }
    } else {
        // Si no se han enviado los campos requeridos, configuramos la respuesta como error
        $response['status'] = 'error';
        $response['message'] = 'Campos incompletos.';
    }
} else {
    // Si no se ha enviado el formulario, configuramos la respuesta como error
    $response['status'] = 'error';
    $response['message'] = 'Método no permitido.';
}

// Devolvemos la respuesta en formato JSON
echo json_encode($response);*/


include_once '../models/Login.class.php';
include_once '../models/database.php'; 

// Definimos un array para almacenar la respuesta
$response = array();

// Verificamos si se ha enviado el formulario de inicio de sesión
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificamos si se han enviado los campos de usuario, contraseña y tipo de usuario
    if (isset($_POST['usuario']) && isset($_POST['contraseña']) && isset($_POST['tipo_usuario'])) {
        // Obtenemos los valores de usuario, contraseña y tipo de usuario desde el formulario
        $usuario = $_POST['usuario'];
        $contraseña = $_POST['contraseña'];
        $tipoUsuario = $_POST['tipo_usuario'];

        try {
            // Definimos la tabla según el tipo de usuario
            $tabla = '';
            switch ($tipoUsuario) {
                case 'administrativo':
                    $tabla = 'administrador';
                    break;
                case 'mesero':
                    $tabla = 'mesero';
                    break;
                case 'recepcionista':
                    $tabla = 'Recepcionista';
                    break;
                default:
                    throw new Exception("Tipo de usuario no válido.");
            }

            // Creamos un objeto Login con los datos del formulario
            $login = new Login($usuario, $contraseña);

            // Preparamos la consulta SQL para verificar las credenciales del usuario
            $stmt = $db->prepare("SELECT usuario, contraseña FROM $tabla WHERE usuario = ? AND contraseña = ?");
            
            // Ejecutamos la consulta con los parámetros
            $stmt->execute([$usuario, $contraseña]);

            // Obtenemos el resultado de la consulta
            $result = $stmt->fetch();

            // Verificamos si se encontró un usuario con las credenciales proporcionadas
            if ($result) {
                // Si se encontró, configuramos la respuesta como éxito
                $response['status'] = 'success';
            } else {
                // Si no se encontró, configuramos la respuesta como error
                $response['status'] = 'error';
                $response['message'] = 'Usuario o contraseña incorrectos.';
            }
        } catch (PDOException $e) {
            // Si hubo una excepción, configuramos la respuesta como error
            $response['status'] = 'error';
            $response['message'] = 'Error del servidor. Intente nuevamente.';
            // Opcionalmente, podríamos agregar información adicional sobre el error
            // $response['error_message'] = $e->getMessage();
        } catch (Exception $e) {
            // Si hubo una excepción personalizada, configuramos la respuesta como error
            $response['status'] = 'error';
            $response['message'] = $e->getMessage();
        }
    } else {
        // Si no se han enviado los campos requeridos, configuramos la respuesta como error
        $response['status'] = 'error';
        $response['message'] = 'Campos incompletos.';
    }
} else {
    // Si no se ha enviado el formulario, configuramos la respuesta como error
    $response['status'] = 'error';
    $response['message'] = 'Método no permitido.';
}

// Devolvemos la respuesta en formato JSON
echo json_encode($response);



?>
