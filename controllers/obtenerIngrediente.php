<?php
include_once '../models/database.php';

header('Content-Type: application/json');

$response = array();

try {
    $stmt = $db->query("SELECT id_ingrediente, nombre FROM Ingrediente");
    $ingredientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['status'] = 'success';
    $response['data'] = $ingredientes;
} catch (PDOException $e) {
    $response['status'] = 'error';
    $response['message'] = 'Error al obtener los ingredientes: ' . $e->getMessage();
}

echo json_encode($response);
?>
