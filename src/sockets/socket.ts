import { Socket } from 'socket.io';
import TicketControl, { Ticket } from '../classes/ticket-control';

export const ticketControl: TicketControl = new TicketControl();

export const siguienteTicket = (cliente: Socket) => {
    cliente.on('siguienteTicket', (data, callback: Function) => {
        let siguiente: string = ticketControl.siguiente;
        callback(siguiente);
    });
}

export const estadoActual = (cliente: Socket) => {
    cliente.emit('estadoActual', {
        actual: ticketControl.ultimoTicket,
        ultimos4: ticketControl.ultimos4
    });
}

export const atenderTicket = (cliente: Socket) => {
    cliente.on('atenderTicket', (data, callback: Function) => {
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }
        let atenderTicket: Ticket | string = ticketControl.atenderTicket(data.escritorio);
        callback(atenderTicket);
        cliente.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.ultimos4
        });
    });
}