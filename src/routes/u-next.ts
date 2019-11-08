import express, { Request, Response } from 'express';
import { base64 } from '../tools/tools';
import path from 'path';
import handlebars from 'hbs';
import {Schema} from "mongoose";
const app = express();

app.set('views', path.resolve(__dirname, '../views'));

handlebars.registerPartials(path.resolve(__dirname, '../views/partials'));

app.get('/', (req: Request, res: Response) => {
    res.redirect('/inicio-de-sesion');
});

app.get('/configuracion', (req: Request, res: Response) => {
    const img = base64('temporal.png');
    res.render('configuracion', { img });
});

app.get('/escritorio', (req: Request, res: Response) => {
    res.render('escritorio');
});

app.get('/index', (req: Request, res: Response) => {
    res.render('index');
});

app.get('/inicio-de-sesion', (req: Request, res: Response) => {
    res.render('inicio-de-sesion');
});

app.post('/inicio-de-sesion', (req: Request, res: Response) => {
    console.log(req.session);
    if(req.body.nombreUsuario == 'root' && req.body.contrasena == 'hola2314') {
        req!.session!.clave = new Schema.Types.ObjectId('6e60dcb9c906c7f5a1325ad6d347f3cd328faf1ac85972af36bfa6c6009d0e5c');
        res.redirect('/index');
        res.end();
    } else {
        res.writeHead(403, {
            Location: 'index'
        });
        res.end();
    }
});

app.get('/nuevo-ticket', (req: Request, res: Response) => {
    res.render('nuevo-ticket');
});

app.get('/publico', (req: Request, res: Response) => {
    res.render('publico');
});

export = app;
