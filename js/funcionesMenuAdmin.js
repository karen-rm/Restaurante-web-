function mostrarSeccion() {
  $('section').css('display', 'block'); // Mostrar la sección estableciendo su estilo 'display' a 'block'
}

function mostrarPlantillaMenu() {
var categoriaPlantilla = '<div id="menu-plantilla" class="categoriaS">' +
   '<h2>Agregar Categoría al Menú:</h2>' +
   '<input type="text" id="nombreCategoria" name="nombreCategoria">' +
   '<button type="submit" id="btn_AgregarCategoria" onclick="agregarCategoria()" >Agregar Categoría</button>' + 
   '</div>';


  var menuPlantilla = '<div id="menu-plantilla">' +
                        '<div class="titulo-y-botones">' +
                            '<h2>Formulario Platillo</h2>' +
                        '</div>' +
                        '<form id="form-agregar-platillo" enctype="multipart/form-data">' +
                            '<div class="form-row">' +
                                '<div class="form-group">' +
                                    '<label for="nombrePlatillo">Nombre del platillo:</label>' +
                                    '<input type="text" id="nombrePlatillo" name="nombre">' +
                                '</div>' +
                                '<div class="form-group">' +
                                    '<label for="descripcion">Descripción:</label>' +
                                    '<textarea id="descripcion" name="descripcion"></textarea>' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-row">' +
                                '<div class="form-group">' +
                                    '<label for="precioPlatillo">Precio:</label>' +
                                    '<input type="number" id="precio" name="precio" step="0.01">' +
                                '</div>' +
                                '<div class="form-group">' +
                                    '<label for="categoriaP">Categoría:</label>' + // Asegúrate de que el ID sea "categoriaP"
                                    '<select id="categoriaP" name="categoria">' +
                                    '</select>' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-row">' +
                                '<div class="form-group">' +
                                    '<label for="ingredientes">Ingredientes:</label>' +
                                    '<select id="ingredientes" name="ingredientes" multiple>' +
                                    '</select>' +
                                '</div>' +
                                '<div class="form-group">' +
                                    '<label for="imagen">Imagen:</label>' +
                                    '<input type="file" id="imagen" name="imagen" accept="image/*">' +
                                '</div>' +
                            '</div>' +
                            '<button id="btn_agregarPlatillo" type="submit">Agregar Platillo</button>' +
                        '</form>' +
                    '</div>';


    var menu= '<h1 class="titulo-Inventario">Menú</h1>' + '<div id="contenido"></div>'; 

$(document).ready(function() {
    // Agrega el contenido del formulario al cuerpo o al contenedor adecuado
    $('#container').html(menuPlantilla);

    // Cargar opciones de ingredientes y componentes extras
    $.ajax({
        url: '../controllers/obtenerIngrediente.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                var ingredientes = response.data;
                var opciones = '';
                ingredientes.forEach(function(ingrediente) {
                    opciones += '<option value="' + ingrediente.id_ingrediente + '">' + ingrediente.nombre + '</option>';
                });
                
                $('#ingredientes').html(opciones);
            } else {
                alert('Error al cargar los ingredientes: ' + response.message);
            }
        },
        error: function() {
            alert('Error en la conexión con el servidor al cargar los ingredientes.');
        }
    });


});


  // Insertar el contenido con título en la sección #contenido
  $('section').html(categoriaPlantilla + menuPlantilla + menu);
}






function inicializarEventos() {
  console.log("Inicializando eventos...");
  var enlaces = $(".links a"); // Selecciona todos los enlaces dentro de la clase .links


  // Maneja el clic en los enlaces
  enlaces.click(function(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    
    var href = $(this).attr('href'); // Obtiene el valor del atributo href del enlace
    
    // Lógica para cambiar el contenido de la sección según el enlace presionado
    switch(href) {
      case '#reportes':
        $('section').html('<p>Contenido de los Reportes</p>'); // Cambiar el contenido de la sección
        mostrarSeccion(); // Mostrar la sección después de cambiar su contenido
        break;
      case '#inventario':
        //$('section').html('<p>Contenido del Inventario</p>'); // Cambiar el contenido de la sección
        cargarInventario();
        mostrarSeccion(); // Mostrar la sección después de cambiar su contenido
        
        break;
      case '#menus':
        //$('section').html('<p>Contenido de los Menús</p>'); // Cambiar el contenido de la sección
        mostrarPlantillaMenu();
        mostrarSeccion(); // Mostrar la sección después de cambiar su contenido
        // Llamar a la función para cargar los datos al cargar la página
    cargarCategoriasYPlatillos();
     cargarCategoriasEnFormulario();
        break;
      default:
        $('section').html('<p>Contenido no disponible</p>'); // Cambiar el contenido de la sección
        mostrarSeccion(); // Mostrar la sección después de cambiar su contenido
    }
  });
}

$(document).ready(function() {
  inicializarEventos();

  // Cargar opciones de ingredientes y componentes extras
    $.ajax({
        url: '../controllers/obtenerIngrediente.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                var ingredientes = response.data;
                var opciones = '';
                ingredientes.forEach(function(ingrediente) {
                    opciones += '<option value="' + ingrediente.id_ingrediente + '">' + ingrediente.nombre + '</option>';
                });
                $('#componentes').html(opciones);
                $('#ingredientes').html(opciones);
            } else {
                alert('Error al cargar los ingredientes: ' + response.message);
            }
        },
        error: function() {
            alert('Error en la conexión con el servidor al cargar los ingredientes.');
        }
    });
});

function cargarInventario() {

  var ingredientePlantilla = '<div id="menu-plantilla">' +
                    '<div>' +
                    '<h2>Formulario Ingrediente</h2>' +
                    '</div>' +
                    '<form id="form-agregar-ingrediente">' +
                    '<div class="form-row">' +
                    '<div class="form-group">' +
                    '<label for="nombre">Nombre del ingrediente:</label>' +
                    '<input type="text" id="nombre" name="nombre" pattern="^[A-Za-z]+$" required>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="familia">Familia:</label>' +
                    '<input type="text" id="familia" name="familia" step="0.01" required>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-row">' +
                    '<div class="form-group">' +
                    '<label for="cantidad">Cantidad:</label>' +
                    '<input type="number" id="cantidad" name="cantidad" min="1" step="1" required>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="categoria">Unidad:</label>' +
                    '<select id="unidad" name="unidad">' +
                    '<option value="KG">KG</option>' +
                    '<option value="BOT 0.75L">BOT 0.75L</option>' +
                    '<option value="BOT 1L">BOT 1L</option>' +
                    '<option value="ENV 3L">ENV 3L</option>' +
                    '<option value="ENV 1L">ENV 1L</option>' +
                    '<option value="BOT 0.5L">BOT 0.5L</option>' +
                    '<option value="ENV 0.5L">ENV 0.5L</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-row">' +
                    '<div class="form-group">' +
                    '<label for="cantidad">Costo unidad:</label>' +
                    '<input type="number" id="costo" name="costo" min="1"  step="0.01" required>' +
                    '</select>' +
                    '</div>' +
                    
                    '</div>' +
                    '<button type="button" id="btn_agregar">Agregar ingrediente</button>' +
                    '</form>' +
                    '<button type="button" id="btn_modificar" style="display: none;">Modificar ingrediente</button>' +
                    '<button type="button" id="btn_cancelar" onclick="cancelarModificar()" style="display: none;">Cancelar</button>' +
                    '</div>';



  
  // Realizar una solicitud AJAX para obtener los datos del inventario desde el servidor
  $.ajax({
    url: '../controllers/gestionarInventario.php',
    type: 'POST',
    success: function(data) {
      // Agregar el título al contenido
      var titulo = '<h1 class="titulo-Inventario">Inventario</h1>';
      
      var contenidoConTitulo = ingredientePlantilla +  titulo + data;
      
      // Insertar el contenido con título en la sección #contenido
      $('section').html(contenidoConTitulo);
    // Insertar directamente el HTML recibido en la sección #contenido
    //$('section').html(data);
    // Ocultar los botones de modificar y cancelar al inicio
    $("#btn_modificar").hide();
    $("#btn_cancelar").hide();
     $("#btn_agregar").show();


},
    error: function() {
      // Manejar el error en caso de que la solicitud AJAX falle
      console.log('Error al cargar el inventario.');
    }
  });
}



// Función para manejar la edición de un ingrediente
function editarIngrediente(id) {
  // Aquí puedes implementar la lógica para editar un ingrediente, como mostrar un formulario de edición.
  console.log("editando ingrediente con id " + id);
  // Realizar una petición AJAX para obtener los datos del ingrediente
  $.ajax({
    url: '../controllers/editarIngrediente.php',
    type: 'POST',
    data: { id: id },
    success: function(response) {
      // Analizar la respuesta JSON recibida del servidor
      try {
        var ingrediente = JSON.parse(response);
        // Verificar si se recibieron los datos correctamente
        if (ingrediente && ingrediente.nombre_ingrediente && ingrediente.nombre_familia && ingrediente.unidad && ingrediente.cantidad && ingrediente.costo_unidad) {
          // Rellenar los campos del formulario con los datos del ingrediente
          $("#nombre").val(ingrediente.nombre_ingrediente);
          $("#familia").val(ingrediente.nombre_familia);
          $("#unidad").val(ingrediente.unidad);
          $("#cantidad").val(ingrediente.cantidad);
          $("#costo").val(ingrediente.costo_unidad);
          //habilitar boton 
          $("#btn_modificar").show().off('click').on('click', function() {
            modificarIngrediente(id); // Llama a la función modificarIngrediente con el id del ingrediente
          });
          $("#btn_cancelar").show();
          // Ocultar el botón
          $("#btn_agregar").hide();
          // Encuentra el formulario por su ID
          var formulario = document.getElementById("form-agregar-ingrediente");
          // Desplázate al formulario
          formulario.scrollIntoView({ behavior: "smooth", block: "start" });
          var id_ingrediente = id; 

      } else {
          alert('Error al obtener los datos del ingrediente.');
      }

      } catch (error) {
        console.error('Error parsing response:', error);
        alert('Error en el servidor. Por favor, intente nuevamente.');
      }
    },
    error: function() {
      alert('Error en la conexión con el servidor. Por favor, intente nuevamente.');
    }
  }); 
}

// Función para manejar la eliminación de un ingrediente
function eliminarIngrediente(id) {
    // Realizar una petición AJAX para obtener el nombre del ingrediente
    $.ajax({
        url: '../controllers/obtenerNombreIngrediente.php',
        type: 'POST',
        data: { id: id },
        dataType: 'json',
        success: function(response) {
            // Manejar la respuesta del servidor
            if (response.status === 'success') {
                // Obtener el nombre del ingrediente
                var nombreIngrediente = response.nombre;

                // Preguntar al usuario si está seguro de eliminar el ingrediente
                var confirmar = confirm("¿Está seguro de eliminar el ingrediente '" + nombreIngrediente + "'?");

                // Verificar si el usuario confirmó la eliminación
                if (confirmar) {
                    // Si el usuario confirma, realizar una petición AJAX para eliminar el ingrediente de la base de datos
                    $.ajax({
                        url: '../controllers/eliminarIngrediente.php',
                        type: 'POST',
                        data: { id: id },
                        dataType: 'json',
                        success: function(deleteResponse) {
                            // Manejar la respuesta del servidor después de eliminar el ingrediente
                            if (deleteResponse.status === 'success') {
                                // Si la eliminación fue exitosa, mostrar un mensaje y actualizar la lista de ingredientes
                                alert('El ingrediente ha sido eliminado correctamente.');
                                cargarInventario(); // Suponiendo que cargarInventario() actualiza la lista de ingredientes en la interfaz
                            } else {
                                // Si hubo un error en la eliminación, mostrar un mensaje de error
                                alert('Error al eliminar el ingrediente: ' + deleteResponse.message);
                            }
                        },
                        error: function() {
                            // Mostrar un mensaje de error en caso de error en la solicitud AJAX para eliminar el ingrediente
                            alert('Error en la conexión con el servidor al eliminar el ingrediente. Por favor, intente nuevamente.');
                        }
                    });
                }
            } else {
                // Si hubo un error al obtener el nombre del ingrediente, mostrar un mensaje de error
                alert('Error al obtener el nombre del ingrediente: ' + response.message);
            }
        },
        error: function() {
            // Mostrar un mensaje de error en caso de error en la solicitud AJAX para obtener el nombre del ingrediente
            alert('Error en la conexión con el servidor al obtener el nombre del ingrediente. Por favor, intente nuevamente.');
        }
    });
}



function agregarIngrediente() {
    // Capturar los valores del formulario
    var nombre = $('#nombre').val();
    var familia = $('#familia').val();
    var unidad = $('#unidad').val();
    var cantidad = $('#cantidad').val();
    var costoUnitario = $('#costo').val();

    console.log(nombre + familia + unidad + cantidad + costoUnitario);

    // Verificar que los datos no estén vacíos y sean válidos
    if (nombre !== "" && familia !== "" && unidad !== "" && cantidad !== "" && costoUnitario !== "" &&
        !isNaN(parseFloat(cantidad)) && !isNaN(parseFloat(costoUnitario)) &&
        parseFloat(cantidad) > 0 && parseFloat(costoUnitario) > 0) {
        // Crear el objeto de datos a enviar
        var nuevoIngrediente = {
            nombre: nombre,
            familia: familia,
            unidad: unidad,
            cantidad: cantidad,
            costoUnitario: costoUnitario
        };

        // Enviar los datos al servidor PHP para su inserción en la base de datos
        $.ajax({
            url: '../controllers/insertarIngrediente.php',
            type: 'POST',
            data: { ingrediente: nuevoIngrediente },
            dataType: 'json', // Especifica el tipo de datos esperados en la respuesta
            success: function(response) {
                // Manejar la respuesta del servidor
                if (response.status === 'confirm') {
                    // Mostrar una ventana de confirmación al usuario
                    if (confirm(response.message)) {
                        // Si el usuario hace clic en "Aceptar", realizar la inserción de la familia
                        $.ajax({
                            url: '../controllers/insertarFamilia.php',
                            type: 'POST',
                            data: { familia: familia },
                            dataType: 'json',
                            success: function(familyResponse) {
                                if (familyResponse.status === 'success') {
                                    alert(familyResponse.message);
                                    // Intentar nuevamente agregar el ingrediente después de insertar la familia
                                    $.ajax({
                                        url: '../controllers/insertarIngrediente.php',
                                        type: 'POST',
                                        data: { ingrediente: nuevoIngrediente },
                                        dataType: 'json',
                                        success: function(retryResponse) {
                                            if (retryResponse.status === 'success') {
                                                alert(retryResponse.message);
                                                cargarInventario();
                                            } else {
                                                alert('Error al agregar el ingrediente: ' + retryResponse.message);
                                            }
                                        },
                                        error: function() {
                                            alert('Error al agregar el ingrediente después de insertar la familia.');
                                        }
                                    });
                                } else {
                                    alert('Error al insertar la familia: ' + familyResponse.message);
                                }
                            },
                            error: function() {
                                alert('Error en la conexión con el servidor al insertar la familia. Por favor, intente nuevamente.');
                            }
                        });
                    } else {
                        // Si el usuario hace clic en "Cancelar", cancelar la operación
                        alert('La operación ha sido cancelada.');
                    }
                } else if (response.status === 'success') {
                    // Si la inserción del ingrediente fue exitosa, mostrar un mensaje de éxito al usuario
                    alert(response.message);
                    cargarInventario();
                } else if (response.status === 'error') {
                    // Si hubo un error en la inserción del ingrediente, mostrar un mensaje de error al usuario
                    alert(response.message);
                }
            },
            error: function() {
                // Mostrar un mensaje de error en caso de error en la solicitud AJAX
                alert('Error al agregar el ingrediente.');
            }
        });

    } else {
        // Si los datos no son válidos, mostrar un mensaje de error
        alert('Por favor, ingrese datos válidos para el ingrediente.');
    }
}


// Llamar a la función cargarInventario() al cargar la página para mostrar el inventario
$(document).ready(function() {
  cargarInventario();

   // Adjuntar el controlador de eventos click al contenedor section utilizando la delegación de eventos
  $('section').on('click', '#btn_agregar', function() {
    // Llamar a la función agregarIngrediente cuando se haga clic en el botón
    console.log("agregarrrrrrr ingredienteeee");
    agregarIngrediente();
  });

  // Ocultar los botones de modificar y cancelar al inicio
    $("#btn_modificar").hide();
    $("#btn_cancelar").hide();

     
  
});

// Función para manejar la modificación de un ingrediente
  function cancelarModificar(){
      console.log("cancelndo operacion:modificar");
      $textoEnBlanco = ""; 
        $("#nombre").val($textoEnBlanco);
        $("#familia").val($textoEnBlanco);
        $("#unidad").val($textoEnBlanco);
        $("#cantidad").val($textoEnBlanco);
        $("#costo").val($textoEnBlanco);
          //habilitar boton 
          $("#btn_modificar").hide();
          $("#btn_cancelar").hide();
          // Ocultar el botón
          $("#btn_agregar").show();
}

 // Función para modificar el ingrediente
function modificarIngrediente(id) {
    var nombre = $("#nombre").val().trim();
    var familia = $("#familia").val().trim();
    var unidad = $("#unidad").val().trim();
    var cantidad = $("#cantidad").val().trim();
    var costo = $("#costo").val().trim();

    // Verificar que todos los campos tengan valores
    if (!nombre || !familia || !unidad || !cantidad || !costo) {
        alert('Todos los campos son obligatorios. Por favor, complete todos los campos.');
        return;
    }

    // Realizar una petición AJAX para obtener el nombre del ingrediente
    $.ajax({
        url: '../controllers/obtenerNombreIngrediente.php',
        type: 'POST',
        data: { id: id },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                var confirmar = confirm("¿Desea modificar el ingrediente '" + response.nombre + "' con los siguientes datos?\n" +
                    "Nombre: " + nombre + "\n" +
                    "Familia: " + familia + "\n" +
                    "Unidad: " + unidad + "\n" +
                    "Cantidad: " + cantidad + "\n" +
                    "Costo: " + costo);

                if (confirmar) {
                    modificarIngredienteAjax(id, nombre, familia, unidad, cantidad, costo);
                }
            } else {
                alert('Error al obtener el nombre del ingrediente: ' + response.message);
            }
        },
        error: function() {
            alert('Error en la conexión con el servidor al obtener el nombre del ingrediente. Por favor, intente nuevamente.');
        }
    });
}

function modificarIngredienteAjax(id, nombre, familia, unidad, cantidad, costo) {
    $.ajax({
        url: '../controllers/modificarIngrediente.php',
        type: 'POST',
        data: {
            id_ingrediente: id,
            nombre: nombre,
            familia: familia,
            unidad: unidad,
            cantidad: cantidad,
            costo: costo
        },
        dataType: 'json',
        success: function(response) {
            console.log("Raw response:", response);
            try {
                var resultado = (typeof response === 'string') ? JSON.parse(response) : response;
                console.log(resultado);
                if (resultado.exito) {
                    alert('Ingrediente modificado con éxito.');
                    cargarInventario();
                } else if (resultado.crearFamilia) {
                    if (confirm('La familia no existe. ¿Desea crearla?')) {
                        $.ajax({
                            url: '../controllers/insertarFamilia.php',
                            type: 'POST',
                            data: { familia: familia },
                            dataType: 'json',
                            success: function(familyResponse) {
                                if (familyResponse.status === 'success') {
                                    alert(familyResponse.message);
                                    modificarIngredienteAjax(id, nombre, familia, unidad, cantidad, costo);
                                } else {
                                    alert('Error al insertar la familia: ' + familyResponse.message);
                                }
                            },
                            error: function() {
                                alert('Error en la conexión con el servidor al insertar la familia. Por favor, intente nuevamente.');
                            }
                        });
                    }
                } else {
                    alert('Error al modificar el ingrediente: ' + resultado.error);
                }
            } catch (error) {
                console.error('Error parsing response:', error);
                alert('Error en el servidor. Por favor, intente nuevamente.');
            }
        },
        error: function() {
            alert('Error en la conexión con el servidor. Por favor, intente nuevamente.');
        }
    });
}

function agregarCategoria() {
    console.log("agregandoCategoria");
    var nomCategoria = $("#nombreCategoria").val().trim();
    
    if (nomCategoria != "") {
        $.ajax({
            url: '../controllers/agregarCategoria.php', // Asegúrate de que esta ruta sea correcta
            type: 'POST',
            data: { categoria: nomCategoria },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    alert('La categoría se ha insertado correctamente con el ID ' + response.id_categoria);
                     $("#nombreCategoria").val("");
                    // Opcional: actualiza la lista de categorías en la interfaz
                    cargarCategoriasYPlatillos();
                     cargarCategoriasEnFormulario();
                } else {
                    alert('Error al insertar la categoría: ' + response.message);
                }
            },
            error: function() {
                alert('Error en la conexión con el servidor. Por favor, intente nuevamente.');
            }
        });
    } else {
        alert("Ingresa un nombre para la categoría.");
    }
}

function cargarCategoriasEnFormulario() {
    $.ajax({
        url: '../controllers/obetenerCategorias.php', // Asegúrate de que la URL sea correcta
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log('Respuesta del servidor:', response); // Log de depuración

            if (response.status === 'success') {
                var categorias = response.data;
                var selectCategoria = $('#categoriaP');

                // Verificar si el select existe
                if (selectCategoria.length === 0) {
                    console.error('El select #categoriaP no se encuentra en el DOM');
                    return;
                }

                // Limpiar el select actual
                selectCategoria.empty();

                // Agregar opción por defecto
                selectCategoria.append('<option value="">Selecciona una categoría</option>');

                // Agregar las nuevas categorías
                categorias.forEach(function(categoria) {
                    var option = $('<option></option>')
                        .attr('value', categoria.nombre)
                        .text(categoria.nombre);
                    selectCategoria.append(option);
                });

                console.log('Categorías cargadas en el select:', selectCategoria.html()); // Log de depuración
            } else {
                alert('Error al cargar las categorías: ' + response.message);
            }
        },
        error: function() {
            alert('Error en la conexión con el servidor al cargar las categorías.');
        }
    });
}


// Define la función para cargar categorías y platillos
function cargarCategoriasYPlatillos() {
    $.ajax({
        url: '../controllers/obtenerCategoriasYPlatillos.php', // Ajusta la URL según sea necesario
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                var categorias = response.data;
                var contenido = '';

                for (var categoria in categorias) {
                    contenido += '<div class="categoria">';
                    contenido += '<h2>' + (categoria || '') + '</h2>'; // Asegurar que no sea null o undefined
                    contenido += '<div class="platillos">';

                    var platillos = categorias[categoria];
                    if (platillos.length === 1 && platillos[0].platillo_nombre === null) {
                        contenido += '<p>Aún no hay platillos en esta categoría.</p>';
                    } else {
                        for (var i = 0; i < platillos.length; i++) {
                            var platillo = platillos[i];
                            if (platillo.platillo_nombre !== null) {
                                contenido += '<div class="platillo">';
                                contenido += '<img src="' + (platillo.imagen_path || 'placeholder.jpg') + '" alt="' + (platillo.platillo_nombre || 'Sin nombre') + '">';
                                contenido += '<div class="info">';
                                contenido += '<h3>' + (platillo.platillo_nombre || 'Sin nombre') + '</h3>';
                                contenido += '<p>' + (platillo.descripcion || 'Sin descripción') + '</p>';
                                contenido += '<p>Precio: ' + (platillo.precio !== null ? platillo.precio : 'No disponible') + '</p>';
                                contenido += '<p>Disponibilidad: ' + (platillo.disponibilidad ? 'Disponible' : 'No disponible') + '</p>';
                                contenido += '</div>'; // info
                                contenido += '</div>'; // platillo
                            }
                        }
                    }

                    contenido += '</div>'; // platillos
                    contenido += '</div>'; // categoria
                }

                $('#contenido').html(contenido); // Asegúrate de tener un contenedor con el id "contenido"
            } else {
                alert('Error al cargar los datos: ' + response.message);
            }
        },
        error: function() {
            alert('Error en la conexión con el servidor en platillos.');
        }
    });
}



$(document).ready(function() {
    // Llamar a la función para cargar los datos al cargar la página
    cargarCategoriasYPlatillos();
   
});

function agregarPlatillo(){
    $('#form-agregar-platillo').on('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        var fileInput = $('#imagen')[0];
        var file = fileInput.files[0];
        var maxSize = 2 * 1024 * 1024; // Tamaño máximo de 2MB

        if (file && file.size > maxSize) {
            alert('El tamaño de la imagen no debe exceder los 2MB.');
            return;
        }

        var formData = new FormData(this);
        formData.append('ingredientes', $('#ingredientes').val());
        
        $.ajax({
            url: '../controllers/agregarPlatillo.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert('Platillo agregado con éxito');
                $('#form-agregar-platillo')[0].reset(); // Limpiar el formulario
            },
            error: function() {
                alert('Error en la conexión con el servidor al agregar el platillo.');
            }
        });
    });
}
