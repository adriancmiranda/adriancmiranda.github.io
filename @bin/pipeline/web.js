const is = require('is');
const { Router } = require('express');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const reporter = require('./reporter');

module.exports = (compiler, options) => {
	options.reporter = options.reporter || reporter(options);
	options.reporter.observe(compiler);

	const app = Router();
	const outputPublicPath = compiler.options.output.publicPath;
	const hasOutputPublicPath = is.string(outputPublicPath);
	const publicPath = hasOutputPublicPath ? outputPublicPath : '/';

	const dev = webpackDev(compiler, { publicPath, quiet: true });
	dev.waitUntilValid(options.ready);
	app.use(dev);

	const hot = webpackHot(compiler, { log: false });
	compiler.plugin('compilation', (compilation) => {
		compilation.plugin('html-webpack-plugin-after-emit', (data, next) => {
			hot.publish({ action: 'reload' });
			next();
		});
	});
	app.use(hot);
	return app;
};
