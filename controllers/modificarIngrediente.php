<?php
include_once '../models/database.php';

// Habilitar reporte de errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // Asegúrate de que el contenido devuelto es JSON

$response = array();
$output = '';

try {
    ob_start(); // Inicia el buffer de salida

    if (isset($_POST['nombre']) && isset($_POST['familia']) && isset($_POST['unidad']) && isset($_POST['cantidad']) && isset($_POST['costo']) && isset($_POST['id_ingrediente'])) {
        $nombre = $_POST['nombre'];
        $familia = $_POST['familia'];
        $unidad = $_POST['unidad'];
        $cantidad = $_POST['cantidad'];
        $costo = $_POST['costo'];
        $id_ingrediente = $_POST['id_ingrediente'];

        try {
            // Verificar si el nombre modificado ya existe para otro ingrediente
            $stmt = $db->prepare('SELECT COUNT(*) AS total FROM Ingrediente WHERE nombre = ? AND id_ingrediente != ?');
            $stmt->execute([$nombre, $id_ingrediente]);
            $existingCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            if ($existingCount > 0) {
                // Si el nombre ya existe para otro ingrediente, devolver un error
                $response['error'] = 'El nombre del ingrediente ya está en uso.';
            } else {
                // Verificar si la familia existe
                $stmt = $db->prepare('SELECT id_familia FROM Familia_Ingrediente WHERE nombre = ?');
                $stmt->execute([$familia]);
                $familiaData = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($familiaData) {
                    $id_familia = $familiaData['id_familia'];
                } else {
                    // Si la familia no existe, preguntar si se desea crearla
                    $response['crearFamilia'] = true;
                    echo json_encode($response);
                    exit;
                }

                // Preparar la consulta para actualizar el ingrediente
                $stmt = $db->prepare('UPDATE Ingrediente SET nombre = ?, id_familia = ?, unidad = ?, cantidad = ?, costo_unidad = ? WHERE id_ingrediente = ?');
                $stmt->execute([$nombre, $id_familia, $unidad, $cantidad, $costo, $id_ingrediente]);

                $response['exito'] = true;
            }
        } catch (PDOException $e) {
            $response['error'] = 'Error al modificar el ingrediente: ' . $e->getMessage();
        }
    } else {
        $response['error'] = 'Datos incompletos.';
    }

    $output = ob_get_clean(); // Captura cualquier salida
    if (!empty($output)) {
        throw new Exception('Output buffer is not empty: ' . $output);
    }
    echo json_encode($response);

} catch (Exception $e) {
    $response['error'] = 'Exception: ' . $e->getMessage();
    echo json_encode($response);
}
?>
