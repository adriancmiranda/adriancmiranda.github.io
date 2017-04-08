const webpack = require('webpack');
const clientBase = require('../common/client-base');

module.exports = $ => clientBase($).cfg({
	entry: undefined,
	devtool: '#inline-source-map',
	module: {
		rules: [],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': $('test.env'),
		}),
	],
});
