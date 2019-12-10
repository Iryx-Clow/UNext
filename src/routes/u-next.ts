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

app.get('/', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const reporteTiemposDeEspera = await Turno.aggregate(
        [
            {
                $match: {
                    idCuenta: empresa!._id,
                    tiempo: {$ne: null}
                }
            },
            {
                $group: {
                    _id: {
                        idCuenta: '$idCuenta',
                    },
                    cantidadTurnos: {$sum: 1},
                    tiempoTotal: {$sum: '$tiempo'},
                    tiempoMaximo: {$max: '$tiempo'},
                    tiempoMinimo: {$min: '$tiempo'}
                },
            },
            {
                $project: {
                    _id: 0,
                    tiempoPromedio: { $divide: [ '$tiempoTotal', '$cantidadTurnos' ] },
                    tiempoMaximo: 1,
                    tiempoMinimo: 1
                }
            },
        ]
    );
    const reporteHorasPico = await Turno.aggregate(
        [
            {
                $match: {
                    idCuenta: empresa!._id
                }
            },
            {
                $project: {
                    hora: { $hour: "$fechaRegistro" },
                }
            },
            {
                $group: {
                    _id: '$hora',
                    cantidadTurnos: {$sum: 1}
                },
            },
            {
                $project: {
                    _id: 1,
                    cantidadTurnos: 1
                }
            },
        ]
    );
    let reporteFinalHorasPico = [];
    for(let i=0; i<24; i++) {
        let posicion = reporteHorasPico.findIndex((hora) => {
            return hora._id === i;
        });
        if (posicion !== -1) {
            reporteFinalHorasPico.push({y: reporteHorasPico[posicion].cantidadTurnos})
        } else {
            reporteFinalHorasPico.push({y: 0});
        }
    }
    console.log(reporteFinalHorasPico);
    console.log(reporteTiemposDeEspera);
    let segundoReporte = {
        tiempoPromedio: reporteTiemposDeEspera[0].tiempoPromedio,
        tiempoMaximoMinutos: (reporteTiemposDeEspera[0].tiempoMaximo / 60),
        tiempoMaximoSegundos: (reporteTiemposDeEspera[0].tiempoMaximo % 60),
        tiempoMinimoMinutos: (reporteTiemposDeEspera[0].tiempoMinimo / 60),
        tiempoMinimoSegundos: (reporteTiemposDeEspera[0].tiempoMinimo / 60)
    };
    const img = base64(empresa!.imagenEmpresa);
    res.render('index', {img, active: {Inicio: true }, color1: empresa!.color1, color2: empresa!.color2, reporteHorasPico: reporteFinalHorasPico, reporteTiemposDeEspera: segundoReporte});
});

app.get('/configuracion', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const imgConfiguracion = base64(empresa!.imagenEmpresa);
    const img = base64(empresa!.imagenEmpresa);
    res.render('configuracion', {imgConfiguracion, img, active: {Configuracion: true }, color1: empresa!.color1, color2: empresa!.color2});
});

app.get('/escritorios', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const escritorios = await Escritorio.find({ idCuenta: req.session!.empresa, activo: true });
    const img = base64(empresa!.imagenEmpresa);
    res.render('escritorios', {img, active: {Escritorios: true }, escritorios, color1: empresa!.color1, color2: empresa!.color2});
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
    res.render('escritorio', {img, nombreEscritorio, color1: empresa!.color1, color2: empresa!.color2});
    }
});

app.get('/index', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const reporteTiemposDeEspera = await Turno.aggregate(
        [
            {
                $match: {
                    idCuenta: empresa!._id,
                    tiempo: {$ne: null}
                }
            },
            {
                $group: {
                    _id: {
                        idCuenta: '$idCuenta',
                    },
                    cantidadTurnos: {$sum: 1},
                    tiempoTotal: {$sum: '$tiempo'},
                    tiempoMaximo: {$max: '$tiempo'},
                    tiempoMinimo: {$min: '$tiempo'}
                },
            },
            {
                $project: {
                    _id: 0,
                    tiempoPromedio: { $divide: [ '$tiempoTotal', '$cantidadTurnos' ] },
                    tiempoMaximo: 1,
                    tiempoMinimo: 1
                }
            },
        ]
    );
    const reporteHorasPico = await Turno.aggregate(
        [
            {
                $match: {
                    idCuenta: empresa!._id
                }
            },
            {
                $project: {
                    hora: { $hour: "$fechaRegistro" },
                }
            },
            {
                $group: {
                    _id: '$hora',
                    cantidadTurnos: {$sum: 1}
                },
            },
            {
                $project: {
                    _id: 1,
                    cantidadTurnos: 1
                }
            },
        ]
    );
    let reporteFinalHorasPico = [];
    for(let i=0; i<24; i++) {
        let posicion = reporteHorasPico.findIndex((hora) => {
            return hora._id === i;
        });
        if (posicion !== -1) {
            reporteFinalHorasPico.push({y: reporteHorasPico[posicion].cantidadTurnos})
        } else {
            reporteFinalHorasPico.push({y: 0});
        }
    }
    console.log(reporteFinalHorasPico);
    console.log(reporteTiemposDeEspera);
    let segundoReporte = {
        tiempoPromedioMinutos: Math.floor(reporteTiemposDeEspera[0].tiempoPromedio / 60),
        tiempoPromedioSegundos: Math.floor(reporteTiemposDeEspera[0].tiempoPromedio % 60),
        tiempoMaximoMinutos: Math.floor(reporteTiemposDeEspera[0].tiempoMaximo / 60),
        tiempoMaximoSegundos: Math.floor(reporteTiemposDeEspera[0].tiempoMaximo % 60),
        tiempoMinimoMinutos: Math.floor(reporteTiemposDeEspera[0].tiempoMinimo / 60),
        tiempoMinimoSegundos: Math.floor(reporteTiemposDeEspera[0].tiempoMinimo % 60)
    };
    const img = base64(empresa!.imagenEmpresa);
    res.render('index', {img, active: {Inicio: true }, color1: empresa!.color1, color2: empresa!.color2, reporteHorasPico: reporteFinalHorasPico, reporteTiemposDeEspera: segundoReporte});
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

app.get('/nuevo-ticket', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const img = base64(empresa!.imagenEmpresa);
    res.render('nuevo-ticket', {img, color1: empresa!.color1, color2: empresa!.color2});
});

app.get('/publico', [validarSesion], async (req: Request, res: Response) => {
    const empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    res.render('publico', {color1: empresa!.color1, color2: empresa!.color2});
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
                res.render('detalles-ticket', { img, numeroTicket, color1: empresa!.color1, color2: empresa!.color2 });
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
