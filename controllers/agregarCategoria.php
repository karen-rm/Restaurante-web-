<?php
// Incluir el archivo que establece la conexión a la base de datos
include_once '../models/database.php';

header('Content-Type: application/json'); // Asegúrate de que el contenido devuelto es JSON

$response = array();

if (isset($_POST['categoria']) && !empty(trim($_POST['categoria']))) {
    $nombreCategoria = trim($_POST['categoria']);

    try {
        $stmt = $db->prepare("INSERT INTO Categoria(nombre) VALUES (?)");
        $stmt->execute([$nombreCategoria]);

        $id_categoria = $db->lastInsertId();

        $response['status'] = 'success';
        $response['id_categoria'] = $id_categoria;
        $response['message'] = 'La categoría se ha insertado correctamente con el ID ' . $id_categoria;
    } catch (PDOException $e) {
        $response['status'] = 'error';
        $response['message'] = 'Error al insertar la categoría en la base de datos.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'No se recibieron los datos de la categoría o el nombre está vacío.';
}

echo json_encode($response);
?>
