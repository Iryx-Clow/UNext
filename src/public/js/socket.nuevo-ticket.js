var socket = io();
var label = $('#lblNuevoTicket');

socket.on('connect', function () {
    console.log('Conectado al servidor');
    socket.emit('entrarEmpresa', function (resp) {
        console.log(resp.message);
    });
});

socket.on('disconnect', function () {
    console.log('Desconectado del servidor');
});

socket.on('estadoActual', function (resp) {
    console.log('Estado actual emitido!!', resp);
    label.text(resp.actual);
});

socket.on('siguienteTicket', function (siguienteTicket) {
    label.text(siguienteTicket);
});

$('button').on('click', function () {
    socket.emit('siguienteTicket');
});
