import express, { Request, Response } from 'express';
import Cuenta from '../models/cuenta';
const app = express();

app.post('/colores', async (req: Request, res: Response) => {
    let empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const color1 = req.body!.color1;
    const color2 = req.body!.color2;
    empresa!.color1 = color1;
    empresa!.color2 = color2;
    empresa!.save((err, empresaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.redirect('/configuracion');
        res.end();
    });
});

export = app;
