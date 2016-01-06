/* global Ambox */
(function(Ambox){
	var Proto = Ambox.namespace('Proto');

	// EventEmitter
	// @support IE9+ without 'strict mode'
	// @see http://caniuse.com/#search=indexOf
	// @todo FunctionIterator
	var EventEmitter = new Proto(function EventEmitter(){
		this.listeners = Proto.create(null);
	});

	EventEmitter.charge('on', function(event, callback){
		callback._context = this;
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(callback);
		return this;
	});

	EventEmitter.charge('on', function(event, callback, context){
		callback._context = context;
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(callback);
		return this;
	});

	EventEmitter.charge('on', function(event, callback, context, groupName){
		callback._groupName = groupName;
		callback._context = context;
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(callback);
		return this;
	});

	EventEmitter.charge('once', function(event, callback){
		var self = this;
		this.on(event, function on(){
			self.off(event, on);
			callback.apply(this, arguments);
		});
		return this;
	});

	EventEmitter.charge('once', function(event, callback, context){
		var self = this;
		this.on(event, function on(){
			self.off(event, on);
			callback.apply(this, arguments);
		}, context);
		return this;
	});

	EventEmitter.charge('once', function(event, callback, context, groupName){
		var self = this;
		this.on(event, function on(){
			self.off(event, on);
			callback.apply(this, arguments);
		}, context, groupName);
		return this;
	});

	EventEmitter.public('off', function(event, callback){
		var index, listeners = this.listeners[event];
		if(!listeners){
			return this;
		}
		if(arguments.length === 1){
			delete this.listeners[event];
			return this;
		}
		index = listeners.indexOf(callback);
		if(~index){
			delete this.listeners[event][index]._groupName;
			delete this.listeners[event][index]._context;
			listeners.splice(index, 1);
		}
		if(listeners.length === 0){
			delete this.listeners[event];
		}
		return this;
	});

	EventEmitter.public('emit', function(event){
		var args = [].slice.call(arguments, 1);
		var listeners, index, total;
		var callbacks = this.listeners[event];
		var specialCallbacks = this.getWildcardListeners(event);
		if(callbacks){
			listeners = callbacks.slice();
			for(index = 0, total = listeners.length; index < total; ++index){
				if(listeners[index]){
					listeners[index].apply(listeners[index]._context, args);
				}else{
					break;
				}
			}
		}
		if(specialCallbacks){
			listeners = specialCallbacks.slice();
			for(index = 0, total = listeners.length; index < total; ++index){
				if(listeners[index]){
					listeners[index].apply(listeners[index]._context, [event].concat(args));
				}else{
					break;
				}
			}
		}
		return this;
	});

	EventEmitter.public('releaseGroup', function(groupName){
		for(var item in this.listeners){
			var handlers = this.listeners[item];
			for(var index = 0, total = handlers.length; index < total; index++){
				if(handlers[index]._groupName === groupName){
					delete handlers[index]._groupName;
					delete handlers[index]._context;
					handlers.splice(index, 1);
					index--;
					total--;
				}
			}
		}
		return this;
	});

	EventEmitter.public('getWildcardListeners', function(eventName){
		var result = [];
		for(var item in this.listeners){
			if(Object.prototype.hasOwnProperty.call(this.listeners, item)){
				var split = item.split('*');
				if (item === '*' || (split.length === 2 && eventName.slice(0, split[0].length) === split[0])){
					result = result.concat(this.listeners[item]);
				}
			}
		}
		return result;
	});

	Ambox.namespace('EventEmitter', EventEmitter);

}).call(this, Ambox);