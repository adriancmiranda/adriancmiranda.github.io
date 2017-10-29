import app from '~/app'; // eslint-disable-line
import opn from 'opn';
import pipeline from '../@bin/webpack/pipeline';

const { NODE_ENV = 'development', HOST = '0.0.0.0', PORT = 3001 } = process.env;

app.set('env', NODE_ENV);
app.use(pipeline());

module.exports = app.listen(PORT, HOST, (err) => {
	if (err) {
		console.error(`Failed start server: ${(err.message || err.toString())}`);
		process.exit(128);
	}
	opn(`http://${HOST}:${PORT}/?debug-nav`);
});
