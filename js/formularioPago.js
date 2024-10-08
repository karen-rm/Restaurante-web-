$(document).ready(function() {
    // Retrieve the order data from localStorage
    var pedido = JSON.parse(localStorage.getItem('pedido'));

    if (pedido) {
        var pedidoContainer = $('#pedido-container');

        // Display each item in the order
        pedido.items.forEach(function(item) {
            var itemHTML = `
                <div class="pedido-item">
                    <h3>${item.nombre} (Cantidad: ${item.cantidad})</h3>
                    <p>Precio: $${item.precio.toFixed(2)}</p>
                    <div class="extras">
                        <strong>Extras:</strong>
                        <ul>
                            ${item.extras.map(extra => `<li>${extra.nombre} - $${extra.precio.toFixed(2)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="ingredientes">
                        <strong>Ingredientes:</strong>
                        <ul>
                            ${item.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            pedidoContainer.append(itemHTML);
        });

        // Display the total price
        $('#total').text(`Total: $${parseFloat(pedido.total).toFixed(2)}`);
    }

    // Show or hide the credit card details based on the payment method selected
    $('input[name="metodo-pago"]').on('change', function() {
        if ($(this).val() === 'tarjeta') {
            $('#datos-tarjeta').show();
        } else {
            $('#datos-tarjeta').hide();
        }
    });

   // Manejar el botón de cancelar
    $('#btn_cancelar').on('click', function() {
        window.history.back();
    });

    // Handle form submission
    $('#payment-form').on('submit', function(event) {
        event.preventDefault();

        var platillosData = pedido.items.map(function(item) {
            return {
                platillo_nombre: item.nombre,
                cantidad: item.cantidad,
                extras: JSON.stringify(item.extras),
                ingredientes: JSON.stringify(item.ingredientes)
            };
        });


        // Get form data
        var clienteNombre = $('#nombre').val();
        var clienteDireccion = $('#direccion').val();
       // var platillosSeleccionados = JSON.parse(localStorage.getItem('pedido')).items;
        var total = parseFloat(pedido.total);


         var ordenData = {
            cliente_nombre: clienteNombre,
            cliente_direccion: clienteDireccion,
            platillos: platillosData, // Envía los detalles de los platillos al servidor
            total: total,
            estado: 'En preparacion'
        };

        $.ajax({
            url: '../controllers/guardar_orden.php', //  por la ruta correcta de tu archivo PHP
            type: 'POST',
            dataType: 'json',
            data: ordenData,
            success: function(response) {
                // Handle success response (e.g., show confirmation message)
                alert('Orden registrada con éxito!');
                localStorage.removeItem('pedido');
                window.location.href = '../views/inicioCliente.html';
            },
            error: function(xhr, status, error) {
                // Handle error response (e.g., display error message)
                console.error('Error al procesar la orden:', error);
                alert('Error al procesar la orden. Inténtalo de nuevo más tarde.');
            }
        });
    });

});
