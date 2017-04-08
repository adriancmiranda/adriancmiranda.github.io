const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const serverBase = require('../common/server-base');

module.exports = $ => serverBase($).cfg({
	name: '[server:dev]',
	devtool: '#cheap-module-eval-source-map',
	externals: [nodeExternals({ whitelist: [] })],
	output: {
		publicPath: $('dev.host'),
		hotUpdateChunkFilename: '[id].[hash].hot-update.js',
		hotUpdateMainFilename: '[hash].hot-update.json',
		hotUpdateFunction: 'webpackHotUpdate',
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': Object.assign({}, $('dev.env'), {
				PORT: $('dev.port') + 1,
			}),
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.NamedModulesPlugin(),
	],
});
