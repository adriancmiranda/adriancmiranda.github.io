import express from 'express';

const app = express();

app.enable('trust proxy');

export default app;
