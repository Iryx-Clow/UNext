import express, { Request, Response } from 'express';
import { base64 } from '../tools/tools';
import path from 'path';
import handlebars from 'hbs';
import Cuenta from '../models/cuenta';
import Escritorio from '../models/escritorio';
import Turno from '../models/turno';
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
    res.render('configuracion', { imgConfiguracion, img, active: { Configuracion: true } });
});

app.get('/escritorios', [validarSesion], async (req: Request, res: Response) => {
    const escritorios = await Escritorio.find({ idCuenta: req.session!.empresa, activo: true });
    const img = base64('favicon2.png');
    res.render('escritorios', { img, active: { Escritorios: true }, escritorios });
});


app.get('/escritorio', [validarSesion], async (req: Request, res: Response) => {
    const idEscritorio = req.query.escritorio;
    if (!idEscritorio) {
        res.redirect('/escritorios');
    } else {
        const escritorio = await Escritorio.findOne({ _id: idEscritorio, activo: true });
        if (!escritorio) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El escritorio solicitado no se encontró'
                }
            })
        }
        const empresa = await Cuenta.findOne({ _id: escritorio.idCuenta });
        const img = base64(empresa!.imagenEmpresa);
        const nombreEscritorio = escritorio.nombre;
        res.render('escritorio', { img, nombreEscritorio });
    }
});

app.get('/index', [validarSesion], (req: Request, res: Response) => {
    const img = base64('favicon2.png');
    res.render('index', { img, active: { Inicio: true } });
});

app.get('/inicio-de-sesion', (req: Request, res: Response) => {
    const img = base64('favicon2.png');
    res.render('inicio-de-sesion', { img });
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
    res.render('nuevo-ticket', { img });
});

app.get('/publico', [validarSesion], (req: Request, res: Response) => {
    res.render('publico');
});

app.get('/detalles-ticket', async (req: Request, res: Response) => {
    const idEmpresa = req.query.idEmpresa;
    const idTicket = req.query.idTicket;
    if (idEmpresa && idTicket) {
        try {
            const empresa = await Cuenta.findOne({ _id: idEmpresa });
            const ticket = await Turno.findOne({ _id: idTicket, idCuenta: idEmpresa });
            if (empresa && ticket) {
                const img = base64(empresa.imagenEmpresa);
                const numeroTicket = ticket.clave;
                res.render('detalles-ticket', { img, numeroTicket });
                return;
            }
        } catch (err) {
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            res.write(`
            <h3> Hubo un error con la URL, verifique que su dispositivo escaneo correctamente el código QR, si está seguro
            de que el escaneo fue correcto, favor de reportar al equipo de soporte</h3>
            `);
            res.end();
            return;
        }
    }
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.write(`
    <h3> Hubo un error con la URL, verifique que su dispositivo escaneo correctamente el código QR, si está seguro
    de que el escaneo fue correcto, favor de reportar al equipo de soporte</h3>
    `);
    res.end();
});

export = app;
