import { Socket, Server } from 'socket.io';
import TicketControlList, { Ticket } from '../classes/ticket-control';

export const ticketControlList: TicketControlList = new TicketControlList();

export const entrarEmpresa = (cliente: Socket, io: Server) => {
    cliente.on('entrarEmpresa', async (callback: Function) => {
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
        await ticketControl.inicializar();
        let dataActual = {
            actual: ticketControl.ultimoTicket,
            ultimos4: ticketControl.ultimos4,
            ultimos4Escritorios: ticketControl.ultimos4Escritorios,
            promedioTiempo: ticketControl.promedioTiempo
        };
        callback({ message: `Conectado a la empresa ${empresa}` });
        io.to(empresa).emit('estadoActual', dataActual);
    });
}

export const entrarEmpresaByIdEmpresa = (cliente: Socket, io: Server) => {
    cliente.on('entrarEmpresaByIdEmpresa', async (data, callback: Function) => {
        let empresa: string = data.idEmpresa;
        if (!empresa) {
            return callback({
                err: true,
                message: 'Error, necesita iniciar sesión con un usuario válido'
            });
        }
        cliente.join(empresa);
        ticketControlList.nuevaEmpresa(empresa);
        let ticketControl = ticketControlList.getTicketsEmpresa(empresa);
        await ticketControl.inicializar();
        let dataActual = {
            actual: ticketControl.ultimoTicket,
            ultimos4: ticketControl.ultimos4,
            ultimos4Escritorios: ticketControl.ultimos4Escritorios,
            promedioTiempo: ticketControl.promedioTiempo
        };
        callback({ message: `Conectado a la empresa ${empresa}` });
        io.to(empresa).emit('estadoActual', dataActual);
    });
}

export const siguienteTicket = (cliente: Socket, io: Server) => {
    cliente.on('siguienteTicket', async () => {
        let empresa = cliente.handshake.session!.empresa;
        if (empresa) {
            let ticketControl = ticketControlList.getTicketsEmpresa(empresa);
            let siguiente = await ticketControl.getSiguiente();
            io.to(empresa).emit('siguienteTicket', siguiente);
        }
    });
}

export const atenderTicket = (cliente: Socket) => {
    cliente.on('atenderTicket', async (data: any, callback: Function) => {
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
        let atenderTicket: Ticket | string;
        let ultimos4: Ticket[] = [];
        let ultimos4Escritorios: string[] = [];
        let promedioTiempo = 0;
        if (!ticketControl) {
            atenderTicket = 'No hay tickets';
        } else {
            atenderTicket = await ticketControl.atenderTicket(data.escritorio);
            ultimos4 = ticketControl.ultimos4;
            ultimos4Escritorios = ticketControl.ultimos4Escritorios;
            promedioTiempo = ticketControl.promedioTiempo;
        }
        callback(atenderTicket);
        cliente.broadcast.to(empresa).emit('ultimos4', { ultimos4, promedioTiempo, ultimos4Escritorios });
    });
}