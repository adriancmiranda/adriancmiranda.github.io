/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');
	var IIterator = scope.uri('IIterator');

	// Iterator
	// @role Iterator pattern `interface/template`
	// @support everywhere
	// @see http://developer.classpath.org/doc/java/util/ArrayList-source.html
	var Iterator = new Proto(function Iterator(list){
		this.index = 0;
		this.items = list;
	}).extends(IIterator);

	Iterator.public('isEmpty', function(){
		return this.items.length === 0;
	});

	Iterator.public('hasPrevious', function(){
		return this.index >= 0;
	});

	Iterator.public('hasNext', function(){
		return this.index <= this.items.length;
	});

	Iterator.public('previous', function(){
		return this.items[this.index--];
	});

	Iterator.public('next', function(){
		return this.items[this.index++];
	});

	Iterator.public('get', function(index){
		return this.items[index];
	});

	Iterator.public('current', function(){
		return this.items[this.index];
	});

	Iterator.public('peek', function(){
		return this.items[this.lastIndex()];
	});

	Iterator.public('lastIndex', function(){
		return this.isEmpty()? 0 : this.items.length - 1;
	});

	Iterator.public('index', function(){
		return this.index;
	});

	Iterator.public('size', function(){
		return this.items.length;
	});

	Iterator.public('lastIndexOf', function(item){
		for(var index = this.items.length - 1; index > 0; index--){
			if(this.items[index] === item){
				return index;
			}
		}
		return -1;
	});

	Iterator.public('indexOf', function(item){
		for(var index = 0; index < this.items.length; index++){
			if(this.items[index] === item){
				return index;
			}
		}
		return -1;
	});

	Iterator.public('contains', function(item){
		return !!~this.indexOf(item);
	});

	Iterator.public('each', function(callback){
		while(this.hasNext()){
			callback(this.current(), this.index());
			this.next();
		}
	});

	Iterator.public('add', function(value){
		return this.items.push(value);
	});

	Iterator.public('addAt', function(value, index){
		return this.items[index] = value;
	});

	Iterator.public('remove', function(value){
		return this.removeAt(this.indexOf(value));
	});

	Iterator.public('removeAt', function(index){
		return !~index && this.items.splice(index, 1);
	});

	Iterator.public('clear', function(flush){
		while(this.items.length){
			this.items.splice(0, 1);
		}
		flush && this.flush();
	});

	// Iterator.public('last', function(){
	// 	this.peak();
	// 	return this.previous();
	// });

	// Iterator.public('first', function(){
	// 	this.reset();
	// 	return this.next();
	// });

	Iterator.public('peak', function(){
		this.index = this.lastIndex();
		return this;
	});

	Iterator.public('reset', function(){
		this.index = 0;
		return this;
	});

	scope.uri('Iterator', Iterator);

}).call(this, Ambox);