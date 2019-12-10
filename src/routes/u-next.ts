import express, { Request, Response } from 'express';
import { base64 } from '../tools/tools';
import path from 'path';
import handlebars from 'hbs';
import Cuenta from '../models/cuenta';
import Escritorio from '../models/escritorio';
import { ICuenta } from "../models/cuenta";
import { validarSesion } from '../middlewares/middlewares';

const app = express();
const sha256 = require('crypto-js/sha256');

app.set('views', path.resolve(__dirname, '../views'));

handlebars.registerPartials(path.resolve(__dirname, '../views/partials'));

app.get('/', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const img = base64('favicon2.png');
    res.render('index', {img, active: {Inicio: true }, color1: empresa!.color1, color2: empresa!.color2});
});

app.get('/configuracion', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const imgConfiguracion = base64(empresa!.imagenEmpresa);
    const img = base64('favicon2.png');
    res.render('configuracion', {imgConfiguracion, img, active: {Configuracion: true }, color1: empresa!.color1, color2: empresa!.color2});
});

app.get('/escritorios', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const escritorios = await Escritorio.find({ idCuenta: req.session!.empresa, activo: true });
    const img = base64('favicon2.png');
    res.render('escritorios', {img, active: {Escritorios: true }, escritorios, color1: empresa!.color1, color2: empresa!.color2});
});


app.get('/escritorio', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const img = base64('favicon2.png');
    res.render('escritorio', {img, color1: empresa!.color1, color2: empresa!.color2});
});

app.get('/index', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const img = base64('favicon2.png');
    res.render('index', {img, active: {Inicio: true }, color1: empresa!.color1, color2: empresa!.color2});
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

app.get('/nuevo-ticket', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const img = base64('favicon2.png');
    res.render('nuevo-ticket', {img, color1: empresa!.color1, color2: empresa!.color2});
});

app.get('/publico', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    res.render('publico', {color1: empresa!.color1, color2: empresa!.color2});
});

app.get('/detalles-ticket', async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const img = base64('favicon2.png');
    res.render('detalles-ticket', {img, color1: empresa!.color1, color2: empresa!.color2});
});

export = app;
