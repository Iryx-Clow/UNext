import { borrarArchivo } from '../tools/tools';
import { verificarImagen } from '../middlewares/middlewares';
import fileUpload, { UploadedFile } from 'express-fileupload';
import path from 'path';
import express, { Request, Response } from 'express';
import Cuenta from '../models/cuenta';
const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.post('/imagen', [verificarImagen], async (req: Request, res: Response) => {
    let empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    const imagen = req.files!.imagen as UploadedFile;
    const nuevoNombre = `${empresa!._id}-${new Date().getMilliseconds()}.${req.formatoImagen}`;
    imagen.mv(path.resolve(__dirname, '../uploads') + `/${nuevoNombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (empresa!.imagenEmpresa !== 'default.png') {
            borrarArchivo(empresa!.imagenEmpresa)
        }
        empresa!.imagenEmpresa = nuevoNombre;
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
});

export = app;
