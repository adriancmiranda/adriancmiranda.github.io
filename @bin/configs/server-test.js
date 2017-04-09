const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const serverBase = require('../common/server-base');

module.exports = $ => serverBase($).cfg({
	name: '[server:test]',
	devtool: '#inline-source-map',
	externals: [nodeExternals({ whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i] })],
	entry: undefined,
	output: {
		publicPath: $(`${$('argv.dev') ? 'dev' : 'build'}.host`),
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': $('test.env'),
		}),
	],
});
