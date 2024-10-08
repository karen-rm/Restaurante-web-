<?php

include_once '../models/database.php'; 

try {
    // Consulta para obtener los datos del inventario
    $sql = "SELECT i.id_ingrediente, i.nombre, f.nombre AS familia, i.unidad, i.cantidad, i.costo_unidad 
            FROM ingrediente i
            JOIN Familia_Ingrediente f ON i.id_familia = f.id_familia"; 
    $stmt = $db->prepare($sql); 
    $stmt->execute(); 

    // Verificar si se obtuvieron resultados
    if ($stmt->rowCount() > 0) {
        // Construir la tabla HTML
        $tablaHTML = '<table>';
        $tablaHTML .= '<tr><th>ID</th><th>Nombre</th><th>Familia</th><th>Unidad</th><th>Cantidad</th><th>Costo Unidad</th><th>Costo Inventario</th><th>Acciones</th></tr>';
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $costoInventario = $row['cantidad'] * $row['costo_unidad'];
            $tablaHTML .= '<tr>';
            $tablaHTML .= '<td>' . $row['id_ingrediente'] . '</td>';
            $tablaHTML .= '<td>' . $row['nombre'] . '</td>';
            $tablaHTML .= '<td>' . $row['familia'] . '</td>';
            $tablaHTML .= '<td>' . $row['unidad'] . '</td>';
            $tablaHTML .= '<td>' . $row['cantidad'] . '</td>';
            $tablaHTML .= '<td>' . $row['costo_unidad'] . '</td>';
            $tablaHTML .= '<td>' . $costoInventario . '</td>';
            $tablaHTML .= '<td><button onclick="editarIngrediente(' . $row['id_ingrediente'] . ')">Editar</button> <button onclick="eliminarIngrediente(' . $row['id_ingrediente'] . ')">Eliminar</button></td>';
            $tablaHTML .= '</tr>';
        }
        $tablaHTML .= '</table>';
        
        // Devolver la tabla HTML
        echo $tablaHTML;
    } else {
        echo "<p>No se encontraron datos de inventario.</p>";
    }
} catch (Exception $e) {
    echo "<p>Error: " . $e->getMessage() . "</p>";
}

?>
