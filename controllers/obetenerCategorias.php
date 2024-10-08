<?php
include_once '../models/database.php';

try {
    $stmt = $db->prepare("SELECT nombre FROM Categoria ORDER BY nombre");
    $stmt->execute();
    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $categorias]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
