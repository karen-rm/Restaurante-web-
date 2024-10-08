// Función para cargar el formulario de registro
function cargarFormularioRegistro() {
    $('.overlay').html(`
        <div class="card">
            <h1 class="cambioFormulario">Registro de Usuario</h1>
            <form id="form-registro">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required>
                <label for="apellido_paterno">Apellido Paterno:</label>
                <input type="text" id="apellido_paterno" name="apellido_paterno" required>
                <label for="apellido_materno">Apellido Materno:</label>
                <input type="text" id="apellido_materno" name="apellido_materno" required>
                <label for="telefono">Teléfono:</label>
                <input type="text" id="telefono" name="telefono" required>
                <label for="correo">Correo Electrónico:</label>
                <input type="email" id="correo" name="correo" required>
                <label for="contraseña">Contraseña:</label>
                <input type="password" id="contraseña" name="contraseña" required>
                <div class="botonesJuntos">
                    <button type="button" id="btn_registrar">Registrar</button>
                    <button type="button" id="btn_regresar">Cancelar</button>
                </div>
            </form>
        </div>
    `);
    attachFormHandlers();
}

// Función para validar la contraseña segura
function isValidPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

// Función para manejar el envío del formulario de registro
function attachFormHandlers() {
    $('#btn_registrar').on('click', function() {
        var nombre = $('#nombre').val().trim();
        var apellidoPaterno = $('#apellido_paterno').val().trim();
        var apellidoMaterno = $('#apellido_materno').val().trim();
        var telefono = $('#telefono').val().trim();
        var correo = $('#correo').val().trim();
        var contraseña = $('#contraseña').val().trim();

        if (!nombre || !apellidoPaterno || !apellidoMaterno || !telefono || !correo || !contraseña) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        if (!/^\d{10}$/.test(telefono)) {
            alert('El teléfono debe contener 10 dígitos.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            alert('Por favor ingrese un correo electrónico válido.');
            return;
        }

        if (!isValidPassword(contraseña)) {
            alert('La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.');
            return;
        }

        // Enviar datos al servidor
        $.ajax({
            url: '../controllers/registrarCliente.php',
            type: 'POST',
            data: {
                nombre: nombre,
                apellido_paterno: apellidoPaterno,
                apellido_materno: apellidoMaterno,
                telefono: telefono,
                correo: correo,
                contraseña: contraseña
            },
            success: function(response) {
                response = JSON.parse(response);
                console.log('Respuesta del servidor:', response);
                if (response.status === 'success') {
                    alert('Registro exitoso.');
                    window.location.href = "../views/inicioCliente.html";
                } else {
                    alert('Error al registrar: ' + response.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error en la conexión:', textStatus, errorThrown);
                alert('Error en la conexión con el servidor.');
            }
        });
    });

    $('#btn_regresar').on('click', function() {
        window.location.href = 'index.html'; // Cambia a la página de inicio de sesión
    });
}

// Función para manejar el inicio de sesión
function iniciarSesion() {
    var correo = $('#correo').val().trim();
    var contraseña = $('#contraseña').val().trim();

    if (!correo || !contraseña) {
        alert('Por favor ingrese usuario y contraseña.');
        return;
    }

    // Enviar datos al servidor para verificar credenciales
    $.ajax({
        url: '../controllers/verificarCredencialesCliente.php',
        type: 'POST',
        data: {
            correo: correo,
            contraseña: contraseña
        },
        success: function(response) {
            response = JSON.parse(response);
            console.log('Respuesta del servidor:', response);
            if (response.status === 'success') {
                alert('Inicio de sesión exitoso.');
                // Redirigir al usuario a la página de inicio
                window.location.href = '../views/inicioCliente.html'; // Cambiar a la URL correcta
            } else {
                alert('Error al iniciar sesión: ' + response.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error en la conexión:', textStatus, errorThrown);
            alert('Error en la conexión con el servidor.');
        }
    });
}

$(document).ready(function() {
    // Redireccionar al formulario de registro
    $('#link_registro').on('click', function(event) {
        event.preventDefault();
        cargarFormularioRegistro();
    });

    // Manejar el inicio de sesión al hacer clic en el botón "Aceptar"
    $('#btn_aceptar').on('click', function() {
        iniciarSesion();
    });
});
