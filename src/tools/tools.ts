import path from 'path';
import fs from 'fs';

export const borrarArchivo = (nombreImagen: string): void => {
    const pathImagen: string = getPathImagen(nombreImagen);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

export const base64 = (nombreImagen: string) => {
    let formatoArray: string[];
    let formato: string;
    let imagenBase64: string;
    let pathImagen: string = getPathImagen(nombreImagen);
    if (!fs.existsSync(pathImagen)) {
        nombreImagen = "temporal.png";
        pathImagen = getPathImagen(nombreImagen);
    }
    formatoArray = nombreImagen.split('.');
    formato = formatoArray[formatoArray.length - 1];
    imagenBase64 = fs.readFileSync(pathImagen, { encoding: 'base64' });
    return `data:image/${formato};base64,${imagenBase64}`;
}

const getPathImagen = (nombreImagen: string): string => {
    return path.resolve(__dirname, `../uploads/${nombreImagen}`);
}