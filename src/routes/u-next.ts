import express, { Request, Response } from 'express';
import { base64 } from '../tools/tools';
import path from 'path';
import handlebars from 'hbs';
import Cuenta from '../models/cuenta';
import { ICuenta } from "../models/cuenta";
import { validarSesion } from '../middlewares/middlewares';

const app = express();
const sha256 = require('crypto-js/sha256');

app.set('views', path.resolve(__dirname, '../views'));

handlebars.registerPartials(path.resolve(__dirname, '../views/partials'));

app.get('/', [validarSesion], (req: Request, res: Response) => {
    res.redirect('/index');
});

app.get('/configuracion', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const imgConfiguracion = base64(empresa!.imagenEmpresa);
    const img = base64('favicon2.png');
    res.render('configuracion', {imgConfiguracion, img, active: {Configuracion: true }});
});

app.get('/escritorios', [validarSesion], (req: Request, res: Response) => {
    const img = base64('favicon2.png');
    res.render('escritorios', {img, active: {Escritorios: true }, escritorios: [{nombre: 1},{nombre: 2},{nombre: 3},{nombre: 4},{nombre: 5}]});
});


app.get('/escritorio', [validarSesion], (req: Request, res: Response) => {
    const img = base64('favicon2.png');
    res.render('escritorio', {img});
});

app.get('/index', [validarSesion], (req: Request, res: Response) => {
    const img = base64('favicon2.png');
    res.render('index', {img, active: {Inicio: true }});
});

app.get('/inicio-de-sesion', (req: Request, res: Response) => {
    const img = base64('favicon2.png');
    res.render('inicio-de-sesion', {img});
});

app.post('/inicio-de-sesion', (req: Request, res: Response) => {
    const condiciones = { nombreUsuario: req.body.nombreUsuario };
    Cuenta.findOne(condiciones, (err: any, cuenta: ICuenta) => {
        if (err) {
            return res.status(500);
        }
        if (!cuenta) {
            return res.status(400);
        }
        if (String(sha256(req.body.contrasena)) === cuenta.contrasena) {
            req.session!.empresa = cuenta._id;
            req.session!.nombreUsuario = req.body.nombreUsuario;
            res.redirect('/index');
            res.end();
        } else {
            res.writeHead(403, { Location: 'index' });
            res.end();
        }
    });
});

app.get('/nuevo-ticket', [validarSesion], (req: Request, res: Response) => {
    const img = base64('favicon2.png');
    res.render('nuevo-ticket', {img});
});

app.get('/publico', [validarSesion], (req: Request, res: Response) => {
    res.render('publico');
});

app.get('/detalles-ticket', (req: Request, res: Response) => {
    const img = base64('favicon2.png');
    res.render('detalles-ticket', {img});
});

export = app;
