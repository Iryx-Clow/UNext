// Comando para establecer la conexión
var socket = io();
var URLturno = "https://174.128.2.64"
var label = $('#lblNuevoTicket');


socket.on('connect', function () {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function () {
    console.log('Desconectado del servidor');
});

// on 'estadoActual'
socket.on('estadoActual', function (resp) {

    console.log(resp);
    label.text(resp.actual);

});


$('button').on('click', function () {

    socket.emit('siguienteTicket', null, function (siguienteTicket) {

        label.text(siguienteTicket);

    });

    console.log("impresion ticket");
    let impresora = new Impresora();
    impresora.feed(1);
    impresora.setAlign("center");
    impresora.setFont("B");
    impresora.setFontSize(2,2);
    impresora.write("UNEXT");
    impresora.feed(1);
    var qrcode=URLturno+"/detalles-ticket?"+label.text();
    impresora.qr(qrcode);
    impresora.setEmphasize(1);
    impresora.write(""+label.text());
    impresora.feed(1);
    impresora.setFont("A");
    impresora.setFontSize(1,1);
    //impresora.cut();
    //impresora.end();
    impresora.imprimirEnImpresora("XP-80C");

});
