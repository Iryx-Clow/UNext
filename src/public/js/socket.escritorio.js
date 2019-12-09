// Comando para establecer la conexión
var socket = io();


var searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = '/';
    throw new Error('El escritorio es necesario');
}

var escritorio = searchParams.get('escritorio');
var ticketEnAtencion = $('#ticketEnAtencion');
var numeroDeTicketEnAtencion = $('#numeroDeTicketEnAtencion');


console.log(escritorio);
$('#numeroEscritorio').text('Escritorio ' + escritorio);


$('button').on('click', function () {

    socket.emit('atenderTicket', {escritorio: escritorio}, function (resp) {
        if (resp === 'No hay tickets') {
            ticketEnAtencion.text('No se esta atendiendo a ningún ticket');
            numeroDeTicketEnAtencion.text('');
            alert('No hay tickets para ser atendidos.');
            return;
        }
        ticketEnAtencion.text('Atendiendo al ');
        numeroDeTicketEnAtencion.text('Ticket ' + resp.numero);

    });

});
