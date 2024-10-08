<?php
include_once '../models/database.php';

try {
    $stmt = $db->prepare("SELECT Categoria.nombre AS categoria_nombre, 
                                 Platillo.nombre AS platillo_nombre,
                                 Platillo.descripcion,
                                 Platillo.precio,
                                 Platillo.disponibilidad,
                                 Platillo.imagen_path
                          FROM Categoria
                          LEFT JOIN Platillo ON Categoria.id_categoria = Platillo.id_categoria
                          ORDER BY Categoria.nombre, Platillo.nombre");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    die();
}

$categorias = [];
foreach ($result as $row) {
    $categorias[$row['categoria_nombre']][] = $row;
}

echo json_encode(['status' => 'success', 'data' => $categorias]);
?>
