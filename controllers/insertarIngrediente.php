<?php
// Incluir el archivo que establece la conexión a la base de datos
include_once '../models/database.php';
// Incluir el archivo que define la clase Ingrediente
include_once '../models/Ingrediente.class.php';

// Inicializar la variable de respuesta
$response = array();

// Verificar si se recibieron los datos del ingrediente
if (isset($_POST['ingrediente'])) {
    // Obtener los datos del ingrediente del arreglo POST
    $ingredienteData = $_POST['ingrediente'];

    // Crear un objeto de tipo Ingrediente con los datos recibidos
    $ingrediente = new Ingrediente(
        $ingredienteData['nombre'],
        $ingredienteData['familia'],
        $ingredienteData['unidad'],
        $ingredienteData['cantidad'],
        $ingredienteData['costoUnitario']
    );

    try {
        // Verificar si el ingrediente ya existe en la tabla Ingrediente por nombre
        $stmt = $db->prepare("SELECT id_ingrediente FROM Ingrediente WHERE nombre = ?");
        $stmt->execute([$ingrediente->getNombre()]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // El ingrediente ya existe
            $response['status'] = 'error';
            $response['message'] = 'El ingrediente ya existe en la base de datos.';
            echo json_encode($response);
            exit();
        }

        // Verificar si la familia ya existe en la tabla Familia_Ingrediente
        $stmt = $db->prepare("SELECT id_familia FROM Familia_Ingrediente WHERE nombre = ?");
        $stmt->execute([$ingrediente->getfamilia()]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // La familia ya existe, obtenemos su ID
            $idFamilia = $result['id_familia'];
        } else {
            // La familia no existe
            // Configurar la respuesta como una confirmación
            $response['status'] = 'confirm';
            $response['message'] = 'La familia ingresada no existe en la base de datos. ¿Desea crearla?';
            echo json_encode($response);
            exit();
        }

        // Asignar el ID de la familia al ingrediente
        $ingrediente->setfamilia($idFamilia);

        // Preparar la consulta SQL para insertar el ingrediente
        $stmt = $db->prepare("INSERT INTO Ingrediente (nombre, id_familia, unidad, cantidad, costo_unidad) VALUES (?, ?, ?, ?, ?)");

        // Ejecutar la consulta con los valores del ingrediente
        $stmt->execute([$ingrediente->getNombre(), $ingrediente->getfamilia(), $ingrediente->getUnidad(), $ingrediente->getCantidad(), $ingrediente->getCostoUnitario()]);

        // Obtener el ID del último ingrediente insertado
        $lastId = $db->lastInsertId();

        // Configurar la respuesta como éxito
        $response['status'] = 'success';
        $response['message'] = 'El ingrediente se ha insertado correctamente con el ID ' . $lastId;
    } catch (PDOException $e) {
        // Si hubo una excepción, configurar la respuesta como error
        $response['status'] = 'error';
        $response['message'] = 'Error del servidor. Intente nuevamente.';
        // Opcionalmente, podríamos agregar información adicional sobre el error
        // $response['error_message'] = $e->getMessage();
    }
} else {
    // Si no se recibieron los datos del ingrediente, configurar la respuesta como error
    $response['status'] = 'error';
    $response['message'] = 'No se recibieron los datos del ingrediente.';
}

// Devolver la respuesta como JSON
echo json_encode($response);
?>
