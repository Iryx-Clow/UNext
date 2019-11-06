import express from 'express';
import socketIO from 'socket.io';
import http from 'http';
import path from 'path';
import * as socket from '../sockets/socket';

export default class Server {

    private static _instance: Server;
    private httpServer: http.Server;
    public port: number;
    public app: express.Application;
    public io: socketIO.Server;

    private constructor() {
        this.app = express();
        this.app.set('view engine', 'hbs');
        this.app.use(require('../routes/index'));
        this.app.use(express.static(path.resolve(__dirname, '../public')));
        this.port = 3000;
        this.httpServer = http.createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.escucharSockets();
    }

    public static get instance() {
        return this._instance || (this._instance = new Server());
    }

    private escucharSockets() {
        this.io.on('connection', cliente => {
            // Siguiente Ticket
            socket.siguienteTicket(cliente);

            // Estado Actual
            socket.estadoActual(cliente);

            // Atender Ticket
            socket.atenderTicket(cliente);
        });

    }

    public start(callback: VoidFunction) {
        this.httpServer.listen(this.port, callback);
    }

}