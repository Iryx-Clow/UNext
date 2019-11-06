import fs from 'fs';

export class Ticket {
    public constructor(public numero: number,
        public escritorio: number | null) { }
}

export default class TicketControl {

    private _ultimo: number;
    private _hoy: number;
    private _tickets: Ticket[];
    private _ultimos4: Ticket[];

    public constructor() {
        this._ultimo = 0;
        this._hoy = new Date().getDate();
        this._tickets = [];
        this._ultimos4 = [];
        let data = require('../data/data.json');
        if (data.hoy === this._hoy) {
            this._ultimo = data.ultimo;
            this._tickets = data.tickets;
            this._ultimos4 = data.ultimos4;
        } else {
            this.reiniciarConteo();
        }
    }

    public get siguiente(): string {
        this._ultimo += 1;
        let ticket = new Ticket(this._ultimo, null);
        this._tickets.push(ticket);
        this.grabarArchivo();
        return `Ticket ${this._ultimo}`;
    }

    public get ultimoTicket(): string {
        return `Ticket ${this._ultimo}`;
    }

    public get ultimos4(): Ticket[] {
        return this._ultimos4;
    }

    public atenderTicket(escritorio: number): Ticket | string {
        if (this._tickets.length === 0) {
            return 'No hay tickets';
        }
        let numeroTicket: number = this._tickets[0].numero;
        this._tickets.shift();
        let atenderTicket: Ticket = new Ticket(numeroTicket, escritorio);
        this._ultimos4.unshift(atenderTicket);
        if (this._ultimos4.length > 4) {
            this._ultimos4.splice(-1, 1);
        }
        this.grabarArchivo();
        return atenderTicket;
    }

    public reiniciarConteo(): void {
        this._ultimo = 0;
        this._tickets = [];
        this._ultimos4 = [];
        this.grabarArchivo();
    }

    grabarArchivo() {
        let jsonData = {
            ultimo: this._ultimo,
            hoy: this._hoy,
            tickets: this._tickets,
            ultimos4: this._ultimos4
        };
        let jsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync('./dist/data/data.json', jsonDataString);
    }

}