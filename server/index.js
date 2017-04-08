import app from '~/app'; // eslint-disable-line

export default (request, response, next) => {
	if (request.url === '/api') {
		console.log('app:', app);
		response.send('server: up & running');
	} else {
		next();
	}
};
