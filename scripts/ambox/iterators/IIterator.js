/* global Ambox */
(function(scope){
	var Interface = scope.uri('Interface');

	// http://kangax.github.io/compat-table/es5/#test-Object.keys
	// http://kangax.github.io/compat-table/es5/#test-Array.prototype.map
	// http://kangax.github.io/compat-table/es5/#test-Array.prototype.some
	// http://kangax.github.io/compat-table/es5/#test-Array.prototype.every
	// http://kangax.github.io/compat-table/es5/#test-Array.prototype.filter
	// http://kangax.github.io/compat-table/es5/#test-Array.prototype.reduce
	// http://kangax.github.io/compat-table/es5/#test-Array.prototype.reduceRight

	// Não pode usar com 'use strict' no IE9
	// http://kangax.github.io/compat-table/es5/#test-Array.prototype.forEach
	// http://kangax.github.io/compat-table/es5/#test-Array.prototype.indexOf
	// http://kangax.github.io/compat-table/es5/#test-Array.prototype.lastIndexOf

	// IIterator - Interface Iterator
	// @role Sequentially access the elements of a collection without knowing the
	// inner workings of the collection.
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	scope.uri('IIterator', new Interface('IIterator', [
		'isEmpty',
		'hasPrevious',
		'hasNext',
		'previous',
		'next',
		'get',
		'current',
		'peek',
		'lastIndex',
		'index',
		'size',
		'lastIndexOf',
		'indexOf',
		'contains',
		'each',
		'add',
		'addAt',
		'remove',
		'removeAt',
		'clear',
		'last',
		'first',
		'peak',
		'reset'
	]));

}).call(this, Ambox);