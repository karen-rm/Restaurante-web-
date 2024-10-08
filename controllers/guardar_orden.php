<?php
// Incluir el archivo que establece la conexión a la base de datos
include_once '../models/database.php';

// Establecer encabezado para devolver JSON
header('Content-Type: application/json');

// Respuesta predeterminada
$response = array();

// Verificar si se recibieron los datos del formulario
if (isset($_POST['cliente_nombre']) && isset($_POST['cliente_direccion']) && isset($_POST['total']) && isset($_POST['platillos'])) {
    // Obtener los datos del formulario
    $clienteNombre = $_POST['cliente_nombre'];
    $clienteDireccion = $_POST['cliente_direccion'];
    $total = $_POST['total'];
    $platillos = $_POST['platillos']; // Array de platillos
    
    // Definir el estado predeterminado como 'pendiente'
    $estado = 'pendiente';

    try {
        // Comenzar una transacción
        $db->beginTransaction();
        
       
        // Insertar cada platillo relacionado con la orden en la tabla Orden
        foreach ($platillos as $platillo) {
            $stmtPlatillo = $db->prepare("INSERT INTO Orden (id, cliente_nombre, cliente_direccion, platillo_nombre, cantidad, extras, ingredientes, total, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmtPlatillo->execute([$idOrden, $clienteNombre, $clienteDireccion, $platillo['nombre'], $platillo['cantidad'], json_encode($platillo['extras']), json_encode($platillo['ingredientes']), $total, $estado]);
        }

        // Confirmar la transacción
        $db->commit();

        // Construir la respuesta de éxito
        $response['status'] = 'success';
        $response['idOrden'] = $idOrden;
        $response['message'] = 'La orden se ha registrado correctamente con el ID ' . $idOrden;
    } catch (PDOException $e) {
        // Si hay un error, revertir la transacción
        $db->rollBack();

        // Construir la respuesta de error
        $response['status'] = 'error';
        $response['message'] = 'Pedido guardado';
        // Opcional: agregar información adicional sobre el error
        // $response['error_message'] = $e->getMessage();
    }
} else {
    // Si no se recibieron los datos del formulario, construir la respuesta de error
    $response['status'] = 'error';
    $response['message'] = 'No se recibieron los datos de la orden.';
}

// Devolver la respuesta como JSON
echo json_encode($response);
?>
