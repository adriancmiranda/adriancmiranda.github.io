/* global Ambox */
(function(Ambox){
	var Proto = Ambox.namespace('Proto');
	var Iterator = Ambox.namespace('Iterator');

	// NullIterator
	// Iterator pattern variation
	// @support everywhere
	var NullIterator = new Proto(function NullIterator(){
		this.super.constructor.call(this);
	}).extends(Iterator);

	NullIterator.public('hasPrevious', function(){
		return false;
	});

	NullIterator.public('hasNext', function(){
		return false;
	});

	NullIterator.public('previous', function(){
		return undefined;
	});

	NullIterator.public('next', function(){
		return undefined;
	});

	NullIterator.public('get', function(){
		return undefined;
	});

	NullIterator.public('current', function(){
		return undefined;
	});

	NullIterator.public('total', function(){
		return 0;
	});

	NullIterator.public('index', function(){
		return 0;
	});

	Ambox.namespace('NullIterator', NullIterator);

}).call(this, Ambox);