import { borrarArchivo, base64 } from '../tools/tools';
import { verificarImagen } from '../middlewares/middlewares';
import fileUpload, { UploadedFile } from 'express-fileupload';
import path from 'path';
import express, { Request, Response } from 'express';
const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.post('/imagen', [verificarImagen], (req: Request, res: Response) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se encontró imagen'
            }
        })
    }
    const imagen: UploadedFile = req.files.imagen as UploadedFile;
    const nuevoNombre: string = `temporal.${req.formatoImagen}`;
    imagen.mv(path.resolve(__dirname, '../uploads') + `/${nuevoNombre}`, (err) => {
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
