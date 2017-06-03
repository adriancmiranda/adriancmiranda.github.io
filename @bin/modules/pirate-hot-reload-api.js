const is = require('is');
const records = window.__PIRATE_HOT_RECORDS__ = Object.create(null);
let lib;

/**
 *
 *
 * @param {} library
 * @return {void}
 */
exports.install = function(library) {
	if (lib) return;
	lib = library;
};

/**
 *
 *
 * @param {} id
 * @param {} options
 * @return {void}
 */
exports.createRecord = function(id, options) {
	if (is.fn(options)) {
		options = options.options;
	}
	makeOptionsHot(id, options);
	records[id] = {
		Ctor: options,
		instances: [],
	};
};

/**
 *
 *
 * @param {} id
 * @param {} options
 * @return {void}
 */
exports.reload = tryWrap(function(id, options) {
	if (is.fn(options)) {
		options = options.options;
	}
	makeOptionsHot(id, options);
	const record = records[id];
	record.instances.slice().forEach(function(instance) {
		if (instance.$node && instance.$node.context) {
			// N/A yet.
		} else {
			console.warn('Root or manually mounted instance modified. Full reload required.');
		}
	});
});

/**
 *
 *
 * @param {} status
 * @return {}
 */
exports.apply = function(status) {
};

/**
 *
 *
 * @param {} error
 * @param {} outdatedModules
 * @return {}
 */
exports.check = function(error, outdatedModules) {
};

/**
 *
 *
 * @param {} dependencies
 * @return {}
 */
exports.decline = function(dependencies) {
};

/**
 *
 *
 * @param {} store
 * @return {}
 */
exports.dispose = function(store) {
};

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 * @return {void}
 */
function injectHook(options, name, hook) {
	const existing = options[name];
	options[name] = existing ? is.array(existing)
		? existing.concat(hook)
		: [existing, hook]
	: [hook];
}

/**
 * Create a logger for an action.
 *
 * @param fn {Function} action
 * @return {Function} action with a catch message.
 */
function tryWrap(fn) {
	return function (id, arg) {
		try { fn(id, arg) } catch(fault) {
			console.error(fault);
			console.warn('Something went wrong during pirate component hot-reload. Full reload required.');
		}
	};
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 * @return {void}
 */
function makeOptionsHot(id, options) {
	injectHook(options, 'beforeCreate', function() {
		records[id].instances.push(this);
	});
	injectHook(options, 'beforeDestroy', function() {
		var instances = records[id].instances;
		instances.splice(instances.indexOf(this), 1);
	});
}
