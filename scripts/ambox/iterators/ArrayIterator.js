/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');
	var Interface = scope.uri('Interface');
	var IIterator = scope.uri('IIterator');

	// ArrayIterator
	// @role Iterator pattern `interface/template`
	// @see http://developer.classpath.org/doc/java/util/ArrayList-source.html
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var ArrayIterator = new Proto(function ArrayIterator(list){
		this.index = 0;
		this.items = list;
	});

	ArrayIterator.public('isEmpty', function(){
		return this.items.length === 0;
	});

	ArrayIterator.public('hasPrevious', function(){
		return this.index >= 0;
	});

	ArrayIterator.public('hasNext', function(){
		return this.index <= this.items.length;
	});

	ArrayIterator.public('previous', function(){
		return this.items[this.index--];
	});

	ArrayIterator.public('next', function(){
		return this.items[this.index++];
	});

	ArrayIterator.public('get', function(index){
		return this.items[index];
	});

	ArrayIterator.public('current', function(){
		return this.items[this.index];
	});

	ArrayIterator.public('peek', function(){
		return this.items[this.lastIndex()];
	});

	ArrayIterator.public('lastIndex', function(){
		return this.isEmpty()? 0 : this.items.length - 1;
	});

	ArrayIterator.public('index', function(){
		return this.index;
	});

	ArrayIterator.public('size', function(){
		return this.items.length;
	});

	ArrayIterator.public('lastIndexOf', function(item){
		for(var index = this.items.length - 1; index > 0; index--){
			if(this.items[index] === item){
				return index;
			}
		}
		return -1;
	});

	ArrayIterator.public('indexOf', function(item){
		for(var index = 0; index < this.items.length; index++){
			if(this.items[index] === item){
				return index;
			}
		}
		return -1;
	});

	ArrayIterator.public('contains', function(item){
		return !!~this.indexOf(item);
	});

	ArrayIterator.public('each', function(callback){
		while(this.hasNext()){
			callback(this.current(), this.index());
			this.next();
		}
	});

	ArrayIterator.public('add', function(value){
		return this.items.push(value);
	});

	ArrayIterator.public('addAt', function(value, index){
		return this.items[index] = value;
	});

	ArrayIterator.public('remove', function(value){
		return this.removeAt(this.indexOf(value));
	});

	ArrayIterator.public('removeAt', function(index){
		return !~index && this.items.splice(index, 1);
	});

	ArrayIterator.public('clear', function(flush){
		while(this.items.length){
			this.items.splice(0, 1);
		}
		flush && this.flush();
	});

	ArrayIterator.public('last', function(){
		this.peak();
		return this.previous();
	});

	ArrayIterator.public('first', function(){
		this.reset();
		return this.next();
	});

	ArrayIterator.public('peak', function(){
		this.index = this.lastIndex();
		return this;
	});

	ArrayIterator.public('reset', function(){
		this.index = 0;
		return this;
	});

	Interface.ensureImplements(ArrayIterator, IIterator);
	scope.uri('Iterator', Iterator);

}).call(this, Ambox);