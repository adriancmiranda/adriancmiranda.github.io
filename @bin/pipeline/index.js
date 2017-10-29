/* eslint-disable global-require */
const { NODE_ENV = 'production' } = process.env;
if (/^(dev(elopment)?|test(ing)?)$/gi.test(NODE_ENV)) {
	const { argv } = require('yargs');
	const webpack = require('webpack');
	const middleware = require('./middleware.js');
	const config = require('../');
	const { NODE_PATH = config.common.res('path.output.bundle') } = process.env;
	const { PORT = config.common.res('dev.port') } = process.env;
	const { HOST = config.common.res('dev.host') } = process.env;
	const static = config.common.res('path.output.static');
	const proxy = config.common.res('dev.proxy');
	const autoOpenBrowser = config.common.res('dev.autoOpenBrowser');
	const testing = /^testing$/i.test(NODE_ENV);
	const webpackConfig = config({ dev: !testing, run: argv.run });
	const multiCompiler = webpack(webpackConfig);
	module.exports = () => middleware(multiCompiler, {
		log: argv.log,
		notify: argv.notify,
		static,
		proxy,
	});
} else module.exports = () => (req, res, next) => {
	if (request.url === '/unkn') {
		response.send('Unkn up & running');
	} else next();
};
