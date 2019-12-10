import express from 'express';
const app = express();

app.use(require('./u-next'));
app.use(require('./imagen'));
app.use(require('./escritorio'));
app.use(require('./colores'));

export =  app;