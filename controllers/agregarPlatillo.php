<?php
include_once '../models/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener datos del formulario
        $nombre = $_POST['nombre'];
        $descripcion = $_POST['descripcion'];
        $precio = $_POST['precio'];
        $categoriaNombre = $_POST['categoria'];
        $ingredientes = isset($_POST['ingredientes']) ? $_POST['ingredientes'] : [];
       
        
        // Manejar la imagen
        $imagenPath = null;
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $imagenNombre = $_FILES['imagen']['name'];
            $imagenTmpNombre = $_FILES['imagen']['tmp_name'];
            $imagenPath = 'uploads/' . $imagenNombre; // Asegúrate de que la carpeta 'uploads' tenga permisos de escritura
            move_uploaded_file($imagenTmpNombre, $imagenPath);
        }

        // Iniciar la transacción
        $db->beginTransaction();

        // Obtener id_categoria a partir del nombre de la categoría
        $stmt = $db->prepare("SELECT id_categoria FROM Categoria WHERE nombre = :nombre");
        $stmt->bindParam(':nombre', $categoriaNombre);
        $stmt->execute();
        $categoria = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$categoria) {
            throw new Exception("Categoría no encontrada");
        }

        $id_categoria = $categoria['id_categoria'];

        // Insertar el platillo
        $stmt = $db->prepare("INSERT INTO Platillo (nombre, descripcion, precio, disponibilidad, id_categoria, imagen_path)
                              VALUES (:nombre, :descripcion, :precio, 1, :id_categoria, :imagen_path)");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':precio', $precio);
        $stmt->bindParam(':id_categoria', $id_categoria);
        $stmt->bindParam(':imagen_path', $imagenPath);
        $stmt->execute();
        $id_platillo = $db->lastInsertId();

        // Insertar los ingredientes en la tabla Detalle
        $stmt = $db->prepare("INSERT INTO Detalle (id_platillo, id_ingrediente, disponibilidad) VALUES (:id_platillo, :id_ingrediente, 1)");
        foreach ($ingredientes as $id_ingrediente) {
            $stmt->bindParam(':id_platillo', $id_platillo);
            $stmt->bindParam(':id_ingrediente', $id_ingrediente);
            $stmt->execute();
        }

        // Insertar los componentes extra en la tabla Detalle
        foreach ($componentes as $id_componente) {
            $stmt->bindParam(':id_platillo', $id_platillo);
            $stmt->bindParam(':id_ingrediente', $id_componente); // Supongo que los componentes se tratan igual que los ingredientes
            $stmt->execute();
        }

        // Confirmar la transacción
        $db->commit();
        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        $db->rollBack();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
?>
