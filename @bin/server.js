const { argv } = require('yargs');
const express = require('express');
const webpack = require('webpack');
const pipeline = require('./pipeline');
const config = require('./');

const { NODE_ENV = JSON.parse(config.common.get('dev.env.NODE_ENV')) } = process.env;
const { NODE_PATH = config.common.res('path.output.bundle') } = process.env;
const { PORT = config.common.get('dev.port') } = process.env;
const { HOST = config.common.get('dev.host') } = process.env;

const testing = /^testing$/i.test(NODE_ENV);
const webpackConfig = config({ dev: !testing, run: argv.run });
const multiCompiler = webpack(webpackConfig);
const app = express();

app.set('env', NODE_ENV);
app.use(pipeline(multiCompiler, {}));

module.exports = app.listen(PORT, HOST, (err) => {
	console.log(err || 'Wait for it...');
});
