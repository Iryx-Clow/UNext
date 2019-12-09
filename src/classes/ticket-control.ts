import Turno from '../models/turno';

export class Ticket {

    public constructor(public id: string | null,
        public idCuenta: string,
        public idEscritorio: string | null,
        public clave: number,
        public fechaRegistro: Date,
        public tiempo: number | null) { }

}

export class TicketControl {

    public inicializado: boolean = false;
    private _ultimo: number;
    private _tickets: Ticket[];
    private _ultimos4: Ticket[];
    private _promedioTiempo: number;
    private _tiempoTotal: number;

    public constructor(private _empresa: string) {
        this._ultimo = 0;
        this._tickets = [];
        this._ultimos4 = [];
        this._tiempoTotal = 0;
        this._promedioTiempo = 0;
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

    public get promedioTiempo(): number {
        return this._promedioTiempo;
    }

    public getTicketsFaltantes(clave: number): number {
        if (this._ultimos4.length === 0) {
            return clave;
        }
        return clave - this._ultimos4[0].clave;
    }

    public async getSiguiente(): Promise<number> {
        try {
            if (this._ultimo === -1) {
                return -1;
            }
            this._ultimo += 1;
            let turno = {
                idCuenta: this._empresa,
                idEscritorio: null,
                clave: this._ultimo,
                fechaRegistro: new Date(),
                tiempo: null
            };
            let turnoDB = await new Turno(turno).save();
            let ticket = new Ticket(
                turnoDB._id,
                turnoDB.idCuenta,
                turnoDB.idEscritorio,
                turnoDB.clave,
                turnoDB.fechaRegistro,
                turnoDB.tiempo
            );
            this._tickets.push(ticket);
            return ticket.clave;
        } catch (err) {
            return -1;
        }
    }

    public async atenderTicket(escritorio: string): Promise<Ticket | string> {
        try {
            if (this._ultimo === -1) {
                return 'Error al cargar los tickets, contacte al equipo de soporte';
            }
            let atenderTicket = this._tickets.shift();
            if (!atenderTicket) {
                return 'No hay tickets';
            }
            atenderTicket.idEscritorio = escritorio;
            let tiempoInicio = atenderTicket.fechaRegistro.getTime();
            let tiempoFinal = new Date().getTime();
            atenderTicket.tiempo = Math.abs(Math.floor((tiempoFinal - tiempoInicio) / 1000));
            this._tiempoTotal += atenderTicket.tiempo;
            this._promedioTiempo = this._tiempoTotal / this._ultimo;
            let turnoDB = await Turno.findOneAndUpdate({ _id: atenderTicket.id }, {
                idEscritorio: atenderTicket.idEscritorio,
                tiempo: atenderTicket.tiempo
            });
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

    public async inicializar(): Promise<void> {
        try {
            if (this.inicializado) {
                return;
            }
            let ticketsAtendidos = await Turno.find({ idCuenta: this._empresa, idEscritorio: {$ne: null} }).collation({
                locale: 'en_US',
                numericOrdering: true
            }).exec();
            let ticketsPendientes = await Turno.find({ idCuenta: this._empresa, idEscritorio: null }).collation({
                locale: 'en_US',
                numericOrdering: true
            }).exec();
            ticketsAtendidos.forEach(ticket => {
                let nuevoTicket = new Ticket(
                    ticket._id,
                    ticket.idCuenta,
                    ticket.idEscritorio,
                    ticket.clave,
                    ticket.fechaRegistro,
                    ticket.tiempo
                );
                this._ultimos4.unshift(nuevoTicket);
                this._tiempoTotal += ticket.tiempo || 0;
            });
            this._ultimos4 = this._ultimos4.splice(0, 4);
            ticketsPendientes.forEach(ticket => {
                let nuevoTicket = new Ticket(
                    ticket._id,
                    ticket.idCuenta,
                    ticket.idEscritorio,
                    ticket.clave,
                    ticket.fechaRegistro,
                    ticket.tiempo
                );
                this._tickets.push(nuevoTicket);
            });
            if (this._tickets.length !== 0) {
                this._ultimo = +this._tickets[this._tickets.length - 1].clave;
            } else {
                if (this._ultimos4.length === 0) {
                    this._ultimo = 0;
                } else {
                    this._ultimo = +this._ultimos4[0].clave;
                }
            }
            if (this._ultimo !== 0) {
                this._promedioTiempo = Math.round(this._tiempoTotal / this._ultimo);
            } else {
                this._promedioTiempo = 0;
            }
            this.inicializado = true;
        } catch (err) {
            this._ultimo = -1;
            console.log(err);
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