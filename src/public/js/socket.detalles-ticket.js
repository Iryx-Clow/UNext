var socket = io();
var turnoActualHTML = $('#turnoActual');
var tiempoFaltanteHTML = $('#tiempoFaltante');
var params = new URLSearchParams(window.location.search);
var idEmpresa = params.get('idEmpresa');

socket.on('connect', function () {
    console.log('Conectado al servidor');
    console.log(idEmpresa);
    socket.emit('entrarEmpresaByIdEmpresa', { idEmpresa: idEmpresa }, function (resp) {
        console.log(resp.message);
    });
});

socket.on('estadoActual', function (data) {
    console.log(data);
    actualizaHTML(data);
});

socket.on('ultimos4', function (data) {
    actualizaHTML(data);
});

function actualizaHTML(data) {
    if (data.ultimos4 && data.ultimos4.length > 0) {
        var turnoActual = data.ultimos4[0].clave;
        turnoActualHTML.html("El <b>Ticket " + turnoActual + "</b> está siendo atentido.");
        if (numeroTicket > turnoActual) {
            var tiempoFaltante = data.promedioTiempo * (numeroTicket - turnoActual);
            var minutos = Math.floor(tiempoFaltante / 60);
            var segundos = tiempoFaltante - (minutos * 60);
            tiempoFaltanteHTML.html("Aproximadamente en <b>" + minutos + " minutos y " + segundos + " segundos</b> seguirá tu turno.");
        } else {
            tiempoFaltanteHTML.html("Su turno ya fue atendido");
        }
    } else {
        turnoActualHTML.html("No se está atendiendo ningún ticket");
    }
}