import app from '~/app'; // eslint-disable-line

console.log('app:', app);
export default (request, response, next) => {
	if (request.url === '/api') {
		response.send('server: up & running', request, response);
	} else {
		next();
	}
};
