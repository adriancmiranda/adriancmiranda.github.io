/* global Ambox */
(function(scope){
	var Interface = scope.uri('Interface');

	// IIterator - Interface Iterator
	// @role Sequentially access the elements of a collection
	// without knowing the inner workings of the collection.
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
		'map',
		'some',
		'every',
		'filter',
		'reduceRight',
		'reduce',
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