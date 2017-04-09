import express from 'express';

const app = express();

app.enable('trust proxy');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

export default app;
