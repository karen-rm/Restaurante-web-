<?php

  $dbInfo = "mysql:host=localhost;dbname=restaurante1";
  $dbUser = "root";
  $dbPassword = "13mysql22";

  try {
    //create a database connection with a PDO object
    $db = new PDO( $dbInfo, $dbUser, $dbPassword );
    error_log("Conexión con la base de datos exitosa!"); 
  }catch (PDOException $e) {
    $error_message = $e->getMessage();
    error_log("La conexión con la base de datos fallo <p>$e</p>");
    exit();
  }

?>
