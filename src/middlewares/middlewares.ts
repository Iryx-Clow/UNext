import { Request, Response, NextFunction } from 'express';

export const verificarImagen = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session!.empresa) {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'Debe iniciar sesión para realizar esta acción'
            }
        })
    }
    if (!req.files || !req.files.imagen || Array.isArray(req.files.imagen)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ninguna imagen o hay varias imagenes'
            }
        });
    }
    const imagen = req.files.imagen;
    const formatosValidos = ['png', 'gif', 'jpg', 'jpeg'];
    let nombreImagen = imagen.name;
    let nombreSplit = nombreImagen.split('.');
    const formatoImagen = nombreSplit[nombreSplit.length - 1];
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

export const validarSesion = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session!.empresa) {
        return res.redirect('/inicio-de-sesion');
    }
    next();
}
