import Server from './classes/server';

const server: Server = Server.instance;

server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
