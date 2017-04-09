const webpack = require('webpack');
const clientBase = require('../base/client-base');

module.exports = $ => clientBase($).cfg({
	name: '[client:test]',
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
