var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('escritorio')) {
    window.location = 'index';
    throw new Error('La empresa/escritorio es necesario');
}

var escritorio = params.get('escritorio');
var ticketEnAtencion = $('#ticketEnAtencion');
var numeroDeTicketEnAtencion = $('#numeroDeTicketEnAtencion');

socket.on('connect', function () {
    socket.emit('entrarEmpresa', function (resp) {
        console.log(resp.message);
    });
});

$('button').on('click', function () {
    socket.emit('atenderTicket', { escritorio: escritorio }, function (resp) {
        if (resp === 'No hay tickets') {
            ticketEnAtencion.text('No se esta atendiendo a ningún ticket');
            numeroDeTicketEnAtencion.text('');
            alert('No hay tickets para ser atendidos.');
            return;
        }
        ticketEnAtencion.text('Atendiendo al ');
        numeroDeTicketEnAtencion.text('Ticket ' + resp.clave);
    });
});