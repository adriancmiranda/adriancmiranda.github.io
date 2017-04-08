import app from './app';

export default (request, response, next) => {
	if (request.url === '/api') {
		console.log('app:', app);
		response.send('server: up & running');
	} else {
		next();
	}
};
