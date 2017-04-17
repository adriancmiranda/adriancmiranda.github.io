const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { styleLoaders } = require('webpack-cfg/templates');

module.exports.postcss = $ => [
	autoprefixer(Object.assign({}, $('style.autoprefixer'), {
		browsers: $('pkg.browsers'),
	})),
];

module.exports.style = ($, fallbackStyle = 'style-loader') => {
	const options = styleLoaders($, fallbackStyle, module.exports.postcss);
	console.log(options.use.scss)
	if (options.extract) {
		Object.keys(options.use).map((name) => {
			const fallback = options.use[name].shift();
			options.use[name] = ExtractTextPlugin.extract({
				publicPath: options.publicPath,
				use: options.use[name],
				fallback,
			});
			return options.use[name];
		});
	}
	return options.use;
};

module.exports.rules = ($, fallback) => {
	const use = module.exports.style($, fallback);
	return Object.keys(use).map((ext) => ({
		test: new RegExp(`\\.${ext}$`),
		use: use[ext],
	}));
};
