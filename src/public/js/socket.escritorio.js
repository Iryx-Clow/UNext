var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('escritorio')) {
    window.location = 'index';
    throw new Error('La empresa/escritorio es necesario');
}

var escritorio = params.get('escritorio');
var label = $('small');

$('h1').text('Escritorio ' + escritorio);

socket.on('connect', function () {
    socket.emit('entrarEmpresa', function (resp) {
        console.log(resp.message);
    });
});

$('button').on('click', function () {
    socket.emit('atenderTicket', { escritorio: escritorio }, function (resp) {
        if (resp === 'No hay tickets') {
            label.text(resp);
            alert(resp);
            return;
        }
        label.text('Ticket ' + resp.numero);
    });
});