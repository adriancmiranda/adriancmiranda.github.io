import path from 'path';
import express from 'express';

const app = express();
app.enable('trust proxy');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use((request, response, next) => {
	if (request.url === '/api') {
		response.send('server: up & running');
	} else next();
});

export default app;
