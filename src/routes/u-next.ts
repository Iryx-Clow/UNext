import express, { Request, Response } from 'express';
import { base64 } from '../tools/tools';
import path from 'path';
import handlebars from 'hbs';
const app = express();

app.set('views', path.resolve(__dirname, '../views'));

handlebars.registerPartials(path.resolve(__dirname, '../views/partials'));

app.get('/', (req: Request, res: Response) => {
    res.render('index');
});

app.get('/configuracion', (req: Request, res: Response) => {
    const img = base64('temporal.png');
    res.render('configuracion', { img });
});

app.get('/escritorio', (req: Request, res: Response) => {
    res.render('escritorio');

});

app.get('/nuevo-ticket', (req: Request, res: Response) => {
    res.render('nuevo-ticket');
});

app.get('/publico', (req: Request, res: Response) => {
    res.render('publico');
});

export = app;