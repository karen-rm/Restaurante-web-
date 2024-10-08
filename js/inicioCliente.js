// Define la función para cargar categorías y platillos
function cargarCategoriasYPlatillos() {
    $.ajax({
        url: '../controllers/obtenerCategoriasYPlatillosC.php', // Ajusta la URL según sea necesario
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
                                contenido += '<img class="platillo-img" src="' + (platillo.imagen_path || 'placeholder.jpg') + '" alt="' + (platillo.platillo_nombre || 'Sin nombre') + '">';
                                contenido += '<div class="info">';
                                contenido += '<h3>' + (platillo.platillo_nombre || 'Sin nombre') + '</h3>';
                                contenido += '<p>' + (platillo.descripcion || 'Sin descripción') + '</p>';
                                contenido += '<p>Precio: ' + (platillo.precio !== null ? platillo.precio : 'No disponible') + '</p>';
                                contenido += '<p>Disponibilidad: ' + (platillo.disponibilidad ? 'Disponible' : 'No disponible') + '</p>';
                                contenido += '<button class="add-to-cart" onclick="ordenar(\'' + platillo.platillo_nombre + '\', \'' + platillo.precio + '\')">Ordenar</button>';
                                contenido += '</div>'; // info
                                contenido += '</div>'; // platillo
                            }
                        }
                    }

                    contenido += '</div>'; // platillos
                    contenido += '</div>'; // categoria
                }

                $('#Menu').html(contenido); // Asegúrate de tener un contenedor con el id "contenido"
            } else {
                alert('Error al cargar los datos: ' + response.message);
            }
        },
        error: function() {
            alert('Error en la conexión con el servidor en platillos.');
        }
    });
}

function ordenar(nombrePlatillo, precioPlatillo) {
    var nombrePlatillo = nombrePlatillo;
    var precioPlatillo = precioPlatillo; 
    console.log(nombrePlatillo + precioPlatillo);
    // Realizar la consulta AJAX para obtener el ID del platillo
    $.ajax({
        url: '../controllers/obtenerIdPlatillo.php', // Ruta al archivo PHP que maneja la consulta
        type: 'POST', // Método de solicitud
        dataType: 'json', // Tipo de datos esperado en la respuesta
        data: { nombrePlatillo: nombrePlatillo }, // Datos que se envían al servidor (nombre del platillo)
        success: function(response) {
            if (response.status === 'success') {
                // ID del platillo obtenido
                var idPlatillo = response.idPlatillo;
                console.log("ID del platillo: " + idPlatillo);
                // Realizar la consulta AJAX para obtener los extras del platillo
                $('#cart-bar2 h3').text(nombrePlatillo); // Nombre del platillo
                $('#cart-bar2 #precio').text('$ ' + precioPlatillo);
                
                obtenerExtras(idPlatillo);
                obtenerIngredientes(idPlatillo);
                // Mostrar el contenedor #cart-bar2
                $('#cart-bar2').show();
                
            } else {
                // Si ocurre algún error en la consulta, mostrar un mensaje en la consola
                console.error('Error al obtener el ID del platillo:', response.message);
            }
        },
        error: function(xhr, status, error) {
            // Si hay un error en la consulta AJAX, mostrarlo en la consola
            console.error('Error en la consulta AJAX:', error);
        }
    });
}

function obtenerExtras(idPlatillo) {
    // Realizar la consulta AJAX para obtener los extras del platillo
    $.ajax({
        url: '../controllers/obtenerExtras.php', // Ruta al archivo PHP que maneja la consulta
        type: 'GET', // Método de solicitud
        dataType: 'json', // Tipo de datos esperado en la respuesta
        data: {id_platillo: idPlatillo}, // Datos que se envían al servidor (ID del platillo)
        success: function(response) {
            if (response.status === 'success') {
                // Manejar la respuesta exitosa aquí
                var extras = response.data;
                console.log('Extras del platillo:', extras);
                
                // Actualizar el contenido del elemento #cart-bar2
                $('#cart-bar2 ul').empty(); // Limpiar lista de extras
                
                // Agregar cada extra a la lista
                extras.forEach(function(extra) {
                    var li = $('<li>');
                    var checkbox = $('<input>').attr('type', 'checkbox').attr('id', 'extra-' + extra.id_extra).attr('data-price', extra.precio_adicional).addClass('extra');
                    var label = $('<label>').attr('for', 'extra-' + extra.id_extra).text(extra.nombre + ' - +$' + extra.precio_adicional);
                    
                    li.append(checkbox).append(label);
                    $('#cart-bar2 ul').append(li);
                });
                
            } else {
                // Manejar los errores de la solicitud aquí
                console.error('Error:', response.message);
            }
        },
        error: function(xhr, status, error) {
            // Manejar los errores de la solicitud AJAX aquí
            console.error('Error en la solicitud AJAX:', error);
        }
    });
}

function obtenerIngredientes(idPlatillo) {
    $.ajax({
        url: '../controllers/obtenerIngredientesPlatillo.php',
        type: 'GET',
        dataType: 'json',
        data: { id_platillo: idPlatillo },
        success: function(response) {
            if (response.status === 'success') {
                var ingredientes = response.data;
                console.log('Ingredientes del platillo:', ingredientes);
                
                // Limpiar la lista de ingredientes anterior si existe
                $('#cart-bar2 .ingredientes').remove();

                // Mostrar los ingredientes obtenidos
                mostrarIngredientes(ingredientes);

            } else {
                console.error('Error:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error en la solicitud AJAX:', error);
        }
    });
}

function mostrarIngredientes(ingredientes) {
    var listaIngredientes = $('<div class="ingredientes"></div>');

    // Verificar si hay ingredientes
    if (ingredientes.length > 0) {
        // Si hay ingredientes, agregar el texto "Personaliza tu platillo"
        var parrafo = $('<p class="parrafo">Personaliza tu platillo</p>');
        listaIngredientes.append(parrafo);

        // Agregar los ingredientes con checkboxes
        ingredientes.forEach(function(ingrediente, index) {
            var checkboxId = 'ingrediente-' + index;
            var checkbox = $('<input>').attr({
                type: 'checkbox',
                name: 'ingrediente',
                value: ingrediente,
                id: checkboxId
            }).addClass('ingrediente');
            var label = $('<label>').attr('for', checkboxId).text('Sin ' + ingrediente);
            var listItem = $('<div>').append(checkbox).append(label);
            listaIngredientes.append(listItem);
        });
    } else {
        // Si no hay ingredientes, no mostrar el texto "Personaliza tu platillo"
        // Simplemente crear la lista de ingredientes vacía
    }

    // Agregar botón "Agregar al carrito"
    var botonAgregarCarrito = $('<button onclick="agregarAlCarrito()">Agregar al carrito</button>');
    listaIngredientes.append(botonAgregarCarrito);

    // Agregar la lista de ingredientes al contenedor #cart-bar2
    $('#cart-bar2').append(listaIngredientes);
}

function obtenerValoresSeleccionados() {
    var valoresSeleccionados = {
        extras: [],
        ingredientes: []
    };

    // Obtener valores seleccionados de los checkboxes de extras
    $('#cart-bar2 input[type="checkbox"].extra').each(function() {
        if ($(this).is(':checked')) {
            var extra = {
                nombre: $(this).next('label').text(),
                precio: parseFloat($(this).attr('data-price'))
            };
            valoresSeleccionados.extras.push(extra);
        }
    });

    // Obtener valores seleccionados de los checkboxes de ingredientes
    $('#cart-bar2 input[type="checkbox"].ingrediente').each(function() {
        if ($(this).is(':checked')) {
            valoresSeleccionados.ingredientes.push($(this).val());
        }
    });

    return valoresSeleccionados;
}


function agregarAlCarrito() {
    var nombrePlatillo = $('#cart-bar2 h3').text();
    var precioPlatillo = parseFloat($('#cart-bar2 #precio').text().replace('$', ''));

    console.log(nombrePlatillo);
    console.log(precioPlatillo);
    var valoresSeleccionados = obtenerValoresSeleccionados();
    console.log(valoresSeleccionados);

    // Crear un elemento de lista para el nuevo ítem del carrito
    var nuevoItem = $('<li>').attr('data-cantidad', 1);

    // Agregar el nombre del platillo como texto al elemento de lista
    nuevoItem.append($('<h4>').text(nombrePlatillo));

    // Crear un elemento de párrafo para mostrar el precio del platillo
    var precio = $('<p class="precio-platillo">').text('Precio: $' + precioPlatillo);

    // Agregar el párrafo del precio al elemento de lista
    nuevoItem.append(precio);

    // Convertir los arrays de valores seleccionados a cadenas de texto y agregarlos como texto al elemento de lista
    var extrasSeleccionadosTexto = valoresSeleccionados.extras.map(function(extra) {
        return extra.nombre + ' ($' + extra.precio + ')';
    }).join(', ');

    var ingredientesSeleccionadosTexto = valoresSeleccionados.ingredientes.join(', ');

    if (extrasSeleccionadosTexto) {
        var extrasSeleccionadosParrafo = $('<div class="extras"><p>').text('Extras: ' + extrasSeleccionadosTexto);
        nuevoItem.append(extrasSeleccionadosParrafo);
    }

    if (ingredientesSeleccionadosTexto) {
        // Verificar si hay ingredientes y no son los mismos que los extras
        if (ingredientesSeleccionadosTexto && !valoresSeleccionados.extras.some(extra => ingredientesSeleccionadosTexto.includes(extra.nombre))) {
            var ingredientesSeleccionadosParrafo = $('<p>').text('Sin: ' + ingredientesSeleccionadosTexto);
            nuevoItem.append(ingredientesSeleccionadosParrafo);
        }
    }

    // Botón para aumentar la cantidad
    var botonAumentar = $('<button class="btn-aumentar">').text('+');
    botonAumentar.on('click', function() {
        var cantidad = parseInt(nuevoItem.attr('data-cantidad')) || 1;
        cantidad++;
        nuevoItem.attr('data-cantidad', cantidad);
        cantidadElemento.text('Cantidad: ' + cantidad);
        actualizarTotal(); // Llamar a actualizarTotal cuando se cambie la cantidad
    });
    nuevoItem.append(botonAumentar);

    // Botón para eliminar el ítem
    var botonEliminar = $('<button class="btn-eliminar">').text('Eliminar');
    botonEliminar.on('click', function() {
        nuevoItem.remove();
        actualizarTotal(); // Llamar a actualizarTotal cuando se elimine el ítem
    });
    nuevoItem.append(botonEliminar);

    // Elemento para mostrar la cantidad
    var cantidadElemento = $('<span>').text('Cantidad: 1');
    nuevoItem.append(cantidadElemento);

    // Agregar el nuevo ítem del carrito a la lista de items del carrito
    $('#cart-items').append(nuevoItem);

    actualizarTotal(); // Llamar a actualizarTotal cuando se añada un nuevo ítem

    $('#cart-bar2').hide();
}




function actualizarTotal() {
    var total = 0;

    // Recorrer cada ítem del carrito y sumar los precios
    $('#cart-items li').each(function() {
        var precioPlatillo = parseFloat($(this).find('.precio-platillo').text().replace('Precio: $', ''));
        var cantidad = parseInt($(this).attr('data-cantidad')) || 1;

        // Obtener los extras y sumar sus precios
        var extras = $(this).find('.extras').text().replace('Extras: ', '').split(', ');
        var precioExtras = 0;
        extras.forEach(function(extra) {
            var match = extra.match(/\+\$(\d+(\.\d{1,2})?)/);
            if (match) {
                var precioExtra = parseFloat(match[1]);
                precioExtras += precioExtra;
            }
        });

        total += (precioPlatillo + precioExtras) * cantidad;
    });

    // Actualizar el elemento #total con el nuevo total
    $('#total').text('Total: $' + total.toFixed(2));
}

function pagar() {
    var items = [];

    $('#cart-items li').each(function() {
        var nombrePlatillo = $(this).find('h4').text();
        var precioPlatillo = parseFloat($(this).find('.precio-platillo').text().replace('Precio: $', ''));
        var cantidad = parseInt($(this).attr('data-cantidad')) || 1;

        // Obtener los extras seleccionados
        var extras = [];
        $(this).find('.extras input[type="checkbox"]:checked').each(function() {
            var nombreExtra = $(this).next('label').text().split(' - ')[0];
            var precioExtra = parseFloat($(this).attr('data-price'));
            extras.push({
                nombre: nombreExtra,
                precio: precioExtra
            });
        });

        // Obtener los ingredientes seleccionados
        var ingredientes = [];
        $(this).find('.ingredientes input[type="checkbox"]:checked').each(function() {
            var ingrediente = $(this).next('label').text().replace('Sin ', '');
            ingredientes.push(ingrediente);
        });

        items.push({
            nombre: nombrePlatillo,
            precio: precioPlatillo,
            extras: extras,
            ingredientes: ingredientes,
            cantidad: cantidad
        });
    });

    var total = $('#total').text().replace('Total: $', '');

    var pedido = {
        items: items,
        total: total
    };

    localStorage.setItem('pedido', JSON.stringify(pedido));
    window.location.href = '../views/formularioPago.html';
}





$(document).ready(function() {
    // Llamar a la función para cargar los datos al cargar la página
    cargarCategoriasYPlatillos();
   
});

