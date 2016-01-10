/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');

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
	var IIterator = new Proto(function IIterator(list){
		// to override
	});

	IIterator.public('isEmpty', function(){
		return true;
	});

	IIterator.public('hasPrevious', function(){
		return false;
	});

	IIterator.public('hasNext', function(){
		return false;
	});

	IIterator.public('previous', function(){
		return null;
	});

	IIterator.public('next', function(){
		return null;
	});

	IIterator.public('get', function(index){
		return null;
	});

	IIterator.public('current', function(){
		return null;
	});

	IIterator.public('peek', function(){
		return null;
	});

	IIterator.public('lastIndex', function(){
		return 0;
	});

	IIterator.public('index', function(){
		return 0;
	});

	IIterator.public('size', function(){
		return 0;
	});

	IIterator.public('lastIndexOf', function(item){
		return -1;
	});

	IIterator.public('indexOf', function(item){
		return -1;
	});

	IIterator.public('contains', function(item){
		return false;
	});

	IIterator.public('each', function(callback){
		// to override
	});

	IIterator.public('add', function(value){
		return 0;
	});

	IIterator.public('addAt', function(value, index){
		return 0;
	});

	IIterator.public('remove', function(value){
		return 0;
	});

	IIterator.public('removeAt', function(index){
		return 0;
	});

	IIterator.public('clear', function(flush){
		// to override
	});

	// IIterator.public('last', function(){
	// 	return null;
	// });

	// IIterator.public('first', function(){
	// 	return null;
	// });

	IIterator.public('peak', function(){
		return this;
	});

	IIterator.public('reset', function(){
		return this;
	});

	scope.uri('IIterator', IIterator);

}).call(this, Ambox);