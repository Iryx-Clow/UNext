import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';

export const verificarImagen = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ninguna imagen o hay varias imagenes'
            }
        });
    }
    const imagen: UploadedFile = req.files.imagen as UploadedFile;
    const formatosValidos: Array<string> = ['png', 'gif', 'jpg', 'jpeg'];
    let nombreImagen: string = imagen.name;
    let nombreSplit: string[] = nombreImagen.split('.');
    const formatoImagen: string = nombreSplit[nombreSplit.length - 1];
    if (formatosValidos.indexOf(formatoImagen) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los formatos para imagen permitidos son ' + formatosValidos.join(', ')
            }
        });
    }
    req.formatoImagen = formatoImagen;
    next();
};
