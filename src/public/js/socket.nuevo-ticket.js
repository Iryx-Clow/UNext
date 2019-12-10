var socket = io();
var URLturno = "https://74.208.24.47/detalles-ticket?"
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
    if (siguienteTicket === -1) {
        label.text('Error al generar ticket, contacte al equipo de soport');
    } else {
        label.text('Ticket ' + siguienteTicket.clave);
        console.log("impresion ticket");
        var impresora = new Impresora();
        impresora.feed(1);
        impresora.setAlign("center");
        impresora.setFont("B");
        impresora.setFontSize(2,2);
        impresora.write("UNEXT");
        impresora.feed(1);
        var qrcode = URLturno + "idEmpresa=" + siguienteTicket.idCuenta;
        qrcode += "&idTicket=" + siguienteTicket.id;
        console.log(qrcode);
        impresora.qr(qrcode);
        impresora.setEmphasize(1);
        impresora.write(""+label.text());
        impresora.feed(1);
        impresora.setFont("A");
        impresora.setFontSize(1,1);
        impresora.imprimirEnImpresora("XP-80C");
    }
});

$('button').on('click', function () {
    socket.emit('siguienteTicket');
});
