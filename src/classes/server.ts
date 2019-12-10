import expressSession from 'express-session';
import express from 'express';
import socketIO from 'socket.io';
import mongoose from 'mongoose';
import http from 'http';
import path from 'path';
import * as socket from '../sockets/socket';
import { MongoError } from 'mongodb';
import sharedSession from 'express-socket.io-session';

export default class Server {

    private static _instance: Server;
    private httpServer: http.Server;
    public port: number;
    public app: express.Application;
    public io: socketIO.Server;

    private constructor() {
        this.app = express();
        this.app.set('view engine', 'hbs');
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
        let session = expressSession({
            name: 'u-next',
            resave: true,
            saveUninitialized: true,
            secret: 'ce_SEVt5d9#eWs5B2QkD8PweX'
        });
        this.app.use(session);
        this.app.use(require('../routes/index'));
        this.app.use(express.static(path.resolve(__dirname, '../public')));
        this.port = 3000;
        this.httpServer = http.createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.io.use(sharedSession(session));
        this.escucharSockets();
        this.iniciarConexionBD();
    }

    public static get instance(): Server {
        return this._instance || (this._instance = new Server());
    }

    private escucharSockets(): void {
        this.io.on('connection', cliente => {
            socket.entrarEmpresa(cliente, this.io);
            socket.entrarEmpresaByIdEmpresa(cliente, this.io);
            socket.siguienteTicket(cliente, this.io);
            socket.atenderTicket(cliente);
        });
    }

    public start(callback: VoidFunction): void {
        this.httpServer.listen(this.port, callback);
    }

    private iniciarConexionBD(): void {
        const mongoURI = "mongodb://admin:Sip8Ut4EwR$2@74.208.24.47";
        mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
            dbName: 'UNext'
        }).then(
            () => console.log('Base de datos online')
        ).catch(
            (err: MongoError) => console.error('Error en la conexión a la base de datos', err.message)
        );
    }

}
