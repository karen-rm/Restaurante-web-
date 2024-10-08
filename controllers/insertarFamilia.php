<?php
// Incluir el archivo que establece la conexión a la base de datos
include_once '../models/database.php';


header('Content-Type: application/json'); // Asegúrate de que el contenido devuelto es JSON

$response = array();

if (isset($_POST['familia'])) {
    $nombreFamilia = $_POST['familia'];

    try {
        $stmt = $db->prepare("INSERT INTO Familia_Ingrediente (nombre) VALUES (?)");
        $stmt->execute([$nombreFamilia]);

        $idFamilia = $db->lastInsertId();

        $response['status'] = 'success';
        $response['idFamilia'] = $idFamilia;
        $response['message'] = 'La familia se ha insertado correctamente con el ID ' . $idFamilia;
    } catch (PDOException $e) {
        $response['status'] = 'error';
        $response['message'] = 'Error al insertar la familia en la base de datos.';
        // Opcional: agregar información adicional sobre el error
        // $response['error_message'] = $e->getMessage();
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'No se recibieron los datos de la familia.';
}

echo json_encode($response);
?>
