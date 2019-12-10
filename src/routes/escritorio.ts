import express, { Request, Response } from 'express';
import { base64 } from '../tools/tools';
import path from 'path';
import handlebars from 'hbs';
import Cuenta from '../models/cuenta';
import Escritorio, { IEscritorio } from '../models/escritorio';
import { validarSesion } from '../middlewares/middlewares';

const app = express();

app.set('views', path.resolve(__dirname, '../views'));
handlebars.registerPartials(path.resolve(__dirname,'../views/partials'));

app.post('/escritorio', [validarSesion],async(req: Request, res: Response) =>{
    const datos = {
        nombre: req.body.nombreNuevoEscritorio
    }
    let empresa = await Cuenta.findOne({ _id: req.session!.empresa });
    if(datos.nombre){
    const escritorio = new Escritorio();
    escritorio.nombre=datos.nombre;
    escritorio.idCuenta = empresa!._id;
    escritorio.activo = true;
    escritorio.fechaRegistro = new Date();
    escritorio.save((err, escritorioDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.redirect('/escritorios');
        res.end();
    });
    }else{
        res.redirect('/escritorios');
        res.end();
    }
});

app.post('/eliminar-escritorio',[validarSesion], async(req:Request, res: Response) =>{
    console.log("Eliminando", req.body.numeroDeEscritorioAEliminar);
    console.log(req.body);
    let escritorio=await Escritorio.findOneAndUpdate({_id: req.body.numeroDeEscritorioAEliminar},{activo:false});
    if(escritorio){
        res.redirect('/escritorios');
        res.end();
    }
    
})
export = app;