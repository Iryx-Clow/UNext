import Turno from '../models/turno';
import { Schema } from 'mongoose';

export class Ticket {

    public constructor(public id: string | null,
        public idCuenta: string,
        public idEscritorio: string | null,
        public clave: string,
        public fechaRegistro: Date) { }

}

export class TicketControl {

    private _ultimo: number;
    private _hoy: number;
    private _tickets: Ticket[];
    private _ultimos4: Ticket[];

    public constructor(private _empresa: string) {
        this._ultimo = 0;
        this._hoy = new Date().getDate();
        this._tickets = [];
        this._ultimos4 = [];
    }

    public async getSiguiente(): Promise<string> {
        try {
            this._ultimo += 1;
            let turno = {
                idCuenta: this._empresa,
                idEscritorio: null,
                clave: `${this._ultimo}`,
                fechaRegistro: new Date()
            };
            let turnoDB = await new Turno(turno).save();
            let ticket = new Ticket(turnoDB._id, turnoDB.idCuenta, turnoDB.idEscritorio, turnoDB.clave, turnoDB.fechaRegistro);
            this._tickets.push(ticket);
            return `Ticket ${ticket.clave}`;
        } catch (err) {
            console.log(err);
            return 'Error al generar ticket, contacte al equipo de soporte';
        }
    }

    public get ultimoTicket(): string {
        return `Ticket ${this._ultimo}`;
    }

    public get ultimos4(): Ticket[] {
        return this._ultimos4;
    }

    public get empresa(): string {
        return this._empresa;
    }

    public async atenderTicket(escritorio: string): Promise<Ticket | string> {
        try {
            let atenderTicket = this._tickets.shift();
            if (!atenderTicket) {
                return 'No hay tickets';
            }
            atenderTicket.idEscritorio = escritorio;
            let turnoDB = await Turno.findOneAndUpdate({ _id: atenderTicket.id }, { idEscritorio: atenderTicket.idEscritorio });
            if (!turnoDB) {
                return 'Error al atender ticket, contacte al equipo de soporte';
            }
            this._ultimos4.unshift(atenderTicket);
            if (this._ultimos4.length > 4) {
                this._ultimos4.pop();
            }
            return atenderTicket;
        } catch (err) {
            return 'Error al atender ticket, contacte al equipo de soporte';
        }
    }

}

export default class TicketControlList {

    private list: TicketControl[] = [];

    public nuevaEmpresa(empresa: string): void {
        let ticketEmpresa = this.list.filter(t => t.empresa === empresa);
        if (ticketEmpresa.length === 0) {
            this.list.push(new TicketControl(empresa));
        }
    }

    public getTicketsEmpresa(empresa: string): TicketControl {
        return this.list.filter(t => t.empresa === empresa)[0];
    }

}