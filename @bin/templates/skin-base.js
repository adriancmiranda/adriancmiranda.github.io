const is = require('is');
const autoprefixer = require('autoprefixer');

exports.parseEntry = ($, importStyle, filename) =>
	`${importStyle} ~${$('path.entry.style', filename)};`
;

exports.parseEntries = ($, importStyle) => {
	const entry = $('style.entry');
	if (is.string(entry)) {
		return exports.parseEntry($, importStyle, entry);
	} else if (is.array(entry)) {
		return entry.map((filename) =>
			exports.parseEntry($, importStyle, filename)
		).join(' ');
	} else if (is.object(entry)) {
		return Object.keys(entry).map((filename) =>
			exports.parseEntry($, importStyle, entry[filename])
		).join(' ');
	}
	throw new TypeError('Invalid style.entry');
};

const cssLoader = ($, type = '') => {
	const action = $('lifecycle');
	const sourceMap = $(`${action}.sourceMap`);
	const minimize = $('argv.dev');
	return {
		css: {
			loader: 'css-loader',
			options: Object.assign({}, $(`style.${type}css`), {
				minimize,
				sourceMap,
			}),
		},
	};
};

exports.loaders = ($, fallback = 'style-loader') => {
	const action = $('lifecycle');
	const parse = exports.parseEntries;
	const env = $(`${action}.env.NODE_ENV`);
	const sourceMap = $(`${action}.sourceMap`);
	const publicPath = $(`${action}.publicPath`);
	const extract = $('argv.dev');
	return {
		publicPath,
		extract,
		use: {
			scss: [fallback, cssLoader($), {
				loader: 'sass-loader',
				options: Object.assign({}, $('style.scss'), {
					sourceMap,
					data: [
						`$env: ${env || 'nil'};`,
						`@import "${parse($, '@import')}";`
					].join(' '),
				}),
			}],
			sass: [fallback, cssLoader($), {
				loader: 'sass-loader',
				options: Object.assign({}, $('style.sass'), {
					indentedSyntax: true,
					sourceMap,
					data: [
						`$env: ${env || 'nil'};`,
						`@import "${parse($, '@import')}";`
					].join(' '),
				}),
			}],
			stylus: [fallback, cssLoader($), {
				loader: 'stylus-loader',
				options: Object.assign({}, $('style.stylus'), {
					sourceMap,
				}),
			}],
			styl: [fallback, cssLoader($), {
				loader: 'stylus-loader',
				options: Object.assign({}, $('style.styl'), {
					sourceMap,
				}),
			}],
			less: [fallback, cssLoader($), {
				loader: 'less-loader',
				options: Object.assign({}, $('style.less'), {
					sourceMap,
				}),
			}],
		},
		css: cssLoader($),
		postcss: cssLoader($, 'post'),
	};
};

exports.style = ($, fallbackStyle) => {
	const postcss = module.exports.postcss;
	const options = exports.loaders($, fallbackStyle, postcss);
	const publicPath = options.publicPath;
	if (options.extract) {
		Object.keys(options.use).map((name) => {
			const fallback = options.use[name].shift();
			// options.use[name].unshift({
			// 	loader: options.use[name],
			// 	options: {
			// 		publicPath,
			// 	},
			// });
			return options.use[name];
		});
	}
	return {};
	// return options.use;
};

exports.rules = ($, fallback) => {
	const use = exports.style($, fallback);
	return Object.keys(use).map((ext) => ({
		test: new RegExp(`\\.${ext}$`),
		use: use[ext],
	}));
};
