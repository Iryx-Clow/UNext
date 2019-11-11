import express, {Request, Response} from 'express';
import {base64} from '../tools/tools';
import path from 'path';
import handlebars from 'hbs';
import {model, Schema} from "mongoose";
import Cuenta from '../models/cuenta';
import {ICuenta} from "../models/cuenta";

const app = express();
const sha256 = require('crypto-js/sha256');

app.set('views', path.resolve(__dirname, '../views'));

handlebars.registerPartials(path.resolve(__dirname, '../views/partials'));

app.get('/', (req: Request, res: Response) => {
    res.redirect('/inicio-de-sesion');
});

app.get('/configuracion', (req: Request, res: Response) => {
    const img = base64('temporal.png');
    res.render('configuracion', {img});
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
    const condiciones = {nombreUsuario: req.body.nombreUsuario};
    Cuenta.findOne(condiciones, (err: any, cuenta: ICuenta) => {
        if (err) {
            return res.status(500);
        }
        if (!cuenta) {
            return res.status(400);
        }
        if (String(sha256(req.body.contrasena)) === cuenta.contrasena) {
            req!.session!.clave = new Schema.Types.ObjectId('6e60dcb9c906c7f5a1325ad6d347f3cd328faf1ac85972af36bfa6c6009d0e5c');
            res.redirect('/index');
            res.end();
        } else {
            res.writeHead(403, {Location: 'index'});
            res.end();
        }
    });
});

app.get('/nuevo-ticket', (req: Request, res: Response) => {
    res.render('nuevo-ticket');
});

app.get('/publico', (req: Request, res: Response) => {
    res.render('publico');
});

export = app;
