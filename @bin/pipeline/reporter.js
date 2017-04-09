const is = require('is');
const chalk = require('chalk');
const notifier = require('node-notifier');
const { ProgressPlugin } = require('webpack');
const trace = require('./trace');

module.exports = (options) => {
	options.log = is.undef(options.log) ? 0 : options.log;
	options.notify = is.undef(options.notify) ? true : options.notify;
	options.dedupErrors = is.undef(options.dedupErrors) ? true : options.dedupErrors;
	trace.enabled = options.log;

	let buildPercent = 100;
	const states = new Map();
	const errors = [];
	const warnings = [];

	function calcBuildPercent() {
		let complete = 0;
		let total = 0;
		states.forEach((state) => {
			if (state.progress !== 1) {
				complete += state.progress;
				total += 1;
			}
		});
		return !total ? 100 : Math.floor((complete / total) * 100);
	}

	function observe(compiler) {
		const state = {
			progress: 1,
			stats: null,
		};

		states.set(compiler, state);

		trace.log = trace.log.bind(trace, compiler.options.name);

		function done(stats) {
			state.stats = stats;
			state.progress = 1;
			buildPercent = calcBuildPercent();

			const jsonStats = state.stats.toJson();
			if (stats.hasErrors()) {
				trace.log('done with ERRORS', 'red', 'bgBlack', 'white');
			} else if (stats.hasWarnings()) {
				trace.log('done with WARNINGS', 'yellow');
			} else {
				trace.log('done', 'green', 'white', 'red');
			}

			state.stats.compilation.errors.forEach((compilationError, i) => {
				const message = compilationError && compilationError.message;
				const source = compilationError && compilationError.module.resource;
				const errorToken = source + message;
				if (!options.dedupErrors || !errors.find(error => error === errorToken)) {
					errors.push(errorToken);
					trace({ left: 'ERROR', tokenColor: 'black', bgColor: 'bgRed' });
					console.log(chalk.red(`ERROR in ${jsonStats.errors[i]}`));
				}
			});

			state.stats.compilation.warnings.forEach((w, i) => {
				warnings.push(w);
				trace({ left: 'WARNING', tokenColor: 'black', bgColor: 'bgYellow' });
				console.log(chalk.yellow(`WARNING in ${jsonStats.warnings[i]}`));
			});

			if (buildPercent === 100) {
				setTimeout(() => {
					let notifyTitle;
					let notifyMessage;
					if (errors.length) {
						notifyTitle = 'Build ERRORS';
						notifyMessage = 'Build completed with errors!';
						trace({ left: '  BUILD-END ', tokenColor: 'black', bgColor: 'bgRed' });
					} else if (warnings.length) {
						notifyTitle = 'Build WARNINGS';
						notifyMessage = 'Build completed with warnings!';
						trace({ left: '  BUILD-END ', tokenColor: 'black', bgColor: 'bgYellow' });
					} else {
						notifyTitle = 'Build successful';
						notifyMessage = 'Build completed successfully.';
						trace({ left: '  BUILD-END ', tokenColor: 'black', bgColor: 'bgGreen' });
					}
					if (options.notify) {
						notifier.notify({ title: notifyTitle, message: notifyMessage, wait: false, sound: false });
					}
				}, 100);
			}
		}

		function progress(pct) {
			state.progress = pct;
			const lastBuildPercent = buildPercent;
			buildPercent = calcBuildPercent();
			if (lastBuildPercent === buildPercent) {
				return;
			}
			if (pct === 0) {
				if (lastBuildPercent === 100) {
					errors.length = 0;
					warnings.length = 0;
					trace({ left: '  BUILD-START ', tokenColor: 'black', bgColor: 'bgGreen' });
				}
			}
		}

		compiler.plugin('done', done);
		new ProgressPlugin(progress).apply(compiler);
		return trace.log;
	}

	return { observe };
};
