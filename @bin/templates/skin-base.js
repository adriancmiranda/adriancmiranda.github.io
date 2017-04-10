const autoprefixer = require('autoprefixer');

exports.loaders = ($, fallback = 'style-loader') => {
	const live = $('argv.dev');
	const action = $('lifecycle');
	const sourceMap = $(`${action}.sourceMap`);
	const publicPath = $(`${action}.publicPath`);
	const minimize = live;
	const extract = live;
	return {
		extract,
		publicPath,
		loaders: {
			scss: {
				loader: 'sass-loader',
				options: Object.assign({}, $('style.scss'), {
					sourceMap,
				}),
			},
			sass: {
				loader: 'sass-loader',
				options: Object.assign({}, $('style.sass'), {
					indentedSyntax: true,
					sourceMap,
				}),
			},
			stylus: {
				loader: 'stylus-loader',
				options: Object.assign({}, $('style.stylus'), {
					sourceMap,
				}),
			},
			styl: {
				loader: 'stylus-loader',
				options: Object.assign({}, $('style.styl'), {
					sourceMap,
				}),
			},
			less: {
				loader: 'less-loader',
				options: Object.assign({}, $('style.less'), {
					sourceMap,
				}),
			},
			css: {
				loader: 'css-loader',
				options: Object.assign({}, $('style.css'), {
					minimize,
					sourceMap,
				}),
			},
			postcss: {
				loader: 'css-loader',
				options: Object.assign({}, $('style.postcss'), {
					minimize,
					sourceMap,
				}),
			},
		},
	};
};

exports.style = ($, fallback) => {
	const options = exports.loaders($, fallback);
	return options;
};

exports.rules = ($, fallback) => {
	const use = exports.style($, fallback);
	return []; /*Object.keys(use).map((ext) => ({ // eslint-disable-line arrow-parens
		test: new RegExp(`\\.${ext}$`),
		use: use[ext],
	}));*/
};
