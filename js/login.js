$(document).ready(function() {
  console.log("Inicializando eventos...");
  $("#btn_aceptar").click(verificarSeleccionTipoEmpleado);
});

function verificarSeleccionTipoEmpleado() {
  var tipoUsuario = $("#tipo_usuario").val();

  if (tipoUsuario === "default") {
    alert("Por favor, seleccione un tipo de empleado.");
  } else {
    verificarCredenciales();
  }
}

function verificarCredenciales() {
  var tipoUsuario = $("#tipo_usuario").val();
  var usuario = $("#usuario").val(); 
  var contraseña = $("#contraseña").val(); 

  if (usuario.trim() === '' || contraseña.trim() === '') {
    alert("Por favor, ingrese tanto su usuario como su contraseña para acceder al sistema.");
    return;
  }

  // Enviar los datos usando $.ajax
  $.ajax({
    url: "../controllers/verificarCredenciales.php",
    type: "POST",
    data: {
      tipo_usuario: tipoUsuario,
      usuario: usuario,
      contraseña: contraseña
    },
    success: function(respuesta) {
      try {
        var response = JSON.parse(respuesta);
        llegadaDatos(response, tipoUsuario);
      } catch (e) {
        console.error("Error parsing response:", e);
        alert("Error en el servidor. Por favor, intente nuevamente.");
      }
    },
    error: function() {
      alert("Error en la conexión con el servidor. Por favor, intente nuevamente.");
    }
  });
}

function llegadaDatos(response, tipoUsuario) {
  console.log(response); 
  if (response.status === "success") {
    // Redireccionamos según el tipo de usuario
    switch(tipoUsuario) {
      case "administrativo":
        window.location.href = "../views/index_admin.html";
        break;
      case "mesero":
        window.location.href = "../views/index_mesero.html";
        break;
      case "recepcionista":
        window.location.href = "../views/index_recepcion.html";
        break;
      default:
        alert("Tipo de usuario no reconocido.");
        break;
    }
  } else {
    // Si la respuesta es error, mostramos un mensaje de error
    alert(response.message || "Usuario o contraseña incorrectos.");
  }
}
