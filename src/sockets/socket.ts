import { Socket, Server } from 'socket.io';
import TicketControlList, { Ticket } from '../classes/ticket-control';
import { Schema } from 'mongoose';

export const ticketControlList: TicketControlList = new TicketControlList();

export const entrarEmpresa = (cliente: Socket, io: Server) => {
    cliente.on('entrarEmpresa', (callback: Function) => {
        let empresa: string = cliente.handshake.session!.empresa;
        if (!empresa) {
            return callback({
                err: true,
                message: 'Error, necesita iniciar sesión con un usuario válido'
            });
        }
        cliente.join(empresa);
        ticketControlList.nuevaEmpresa(empresa);
        let ticketControl = ticketControlList.getTicketsEmpresa(empresa);
        let dataActual = {
            actual: ticketControl.ultimoTicket,
            ultimos4: ticketControl.ultimos4
        };
        callback({ message: `Conectado a la empresa ${empresa}` });
        io.to(empresa).emit('estadoActual', dataActual);
    });
}

export const siguienteTicket = (cliente: Socket, io: Server) => {
    cliente.on('siguienteTicket', () => {
        let empresa = cliente.handshake.session!.empresa;
        if (empresa) {
            let siguiente: string = ticketControlList.getTicketsEmpresa(empresa).siguiente
            io.to(empresa).emit('siguienteTicket', siguiente);
        }
    });
}

export const atenderTicket = (cliente: Socket) => {
    cliente.on('atenderTicket', (data: any, callback: Function) => {
        let empresa = cliente.handshake.session!.empresa;
        if (!empresa) {
            return callback({
                err: true,
                message: 'Error, necesita iniciar sesión con un usuario válido'
            });
        } else if (!data.escritorio) {
            return callback({
                err: true,
                message: 'El escritorio es necesario'
            });
        }
        let ticketControl = ticketControlList.getTicketsEmpresa(empresa);
        let atenderTicket;
        let ultimos4: Ticket[] = [];
        if (!ticketControl) {
            atenderTicket = 'No hay tickets';
        } else {
            atenderTicket = ticketControl.atenderTicket(data.escritorio);
            ultimos4 = ticketControl.ultimos4;
        }
        callback(atenderTicket);
        cliente.broadcast.to(empresa).emit('ultimos4', { ultimos4 });
    });
}