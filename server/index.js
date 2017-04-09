import app from '~/app'; // eslint-disable-line

console.log('app:', app);
export default (request, response, next) => {
	if (request.url === '/api') {
		console.log(request, response);
		response.send('server: up & running');
	} else {
		next();
	}
};
