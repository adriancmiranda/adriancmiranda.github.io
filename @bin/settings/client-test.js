const webpack = require('webpack');
const clientBase = require('../templates/client-base');
const skinBase = require('../templates/skin-base');

module.exports = $ => clientBase($).cfg({
	name: '[client:test]',
	entry: undefined,
	devtool: '#inline-source-map',
	module: {
		rules: skinBase.rules($),
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': $('test.env'),
		}),
	],
});
