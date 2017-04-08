const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { prependEntries } = require('webpack-cfg/tools');
const clientBase = require('../common/client-base');

module.exports = $ => clientBase($).cfg('entry', [
	$('pwd', 'pipeline/action'),
], prependEntries).cfg({
	name: 'client:dev',
	devtool: '#cheap-module-eval-source-map',
	devServer: {
		quiet: true,
		compress: true,
		historyApiFallback: true,
		contentBase: $('cwd', $('path.output.bundle')),
		stats: 'errors-only',
		host: $('dev.host'),
		port: $('dev.port'),
		open: $('dev.autoOpenBrowser'),
		proxy: $('dev.proxyTable'),
	},
	output: {
		publicPath: $('dev.publicPath'),
	},
	module: {
		rules: [],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': $('dev.env'),
			'process.type': '"renderer"',
		}),
		new HtmlWebpackPlugin(Object.assign({}, $('view.data'), {
			env: JSON.parse($('dev.env.NODE_ENV')),
			template: `!!pug-loader!${$('view.entry')}`,
			minify: false,
		})),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.NamedModulesPlugin(),
		new FriendlyErrorsPlugin(),
	],
});
