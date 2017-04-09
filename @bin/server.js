const { argv } = require('yargs');
const express = require('express');
const webpack = require('webpack');
const pipeline = require('./pipeline');
const config = require('./');

const { NODE_PATH = config.common.res('path.output.bundle') } = process.env;
const { NODE_ENV = JSON.parse(config.common.get('dev.env.NODE_ENV')) } = process.env;
const { PORT = config.common.get('dev.port') } = process.env;
const { HOST = config.common.get('dev.host') } = process.env;

const static = config.common.res('path.output.static');
const proxy = config.common.get('dev.proxy');
const testing = /^testing$/i.test(NODE_ENV);
const webpackConfig = config({ dev: !testing, run: argv.run });
const multiCompiler = webpack(webpackConfig);
const pipe = pipeline(multiCompiler, { log: argv.log, notify: argv.notify, proxy, static });
const app = express();

app.set('env', NODE_ENV);
app.use(pipe);

module.exports = app.listen(PORT, HOST, (err) => {
	if (err) {
		console.error(`Failed start server: ${(err.message || err.toString())}`);
    process.exit(128);
	}
	console.log('Wait for it...\n');
});
