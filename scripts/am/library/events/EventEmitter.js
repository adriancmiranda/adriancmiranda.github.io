define([
	'../utils/Map',
	'../utils/Class'
], function(Map, Class){
	'use strict';

	var EventEmitter = new Class(function EventEmitter(){
		this.listeners = {};
	});

	EventEmitter.method('on', function(event, groupName, callback, context){
		var hasGroup = (arguments.length >= 3);
		var group = hasGroup ? groupName : undefined;
		var fn = hasGroup ? callback : groupName;
		fn.__groupName = group;
		fn.__context = context || this;
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(fn);
		return this;
	});

	EventEmitter.method('once', function(event, groupName, callback, context){
		var self = this;
		var hasGroup = (arguments.length >= 3);
		var group = hasGroup ? groupName : undefined;
		var fn = hasGroup ? callback : groupName;
		this.on(event, group, function on(){
			self.off(event, on);
			fn.apply(this, arguments);
		}, context);
		return this;
	});

	EventEmitter.method('off', function(event, callback){
		var index, listeners = this.listeners[event];
		if(!listeners){
			return this;
		}
		if(arguments.length === 1){
			delete this.listeners[event];
			return this;
		}
		index = Map.inArray(listeners, callback);
		delete this.listeners[event][index].__groupName;
		delete this.listeners[event][index].__context;
		listeners.splice(index, 1);
		if(listeners.length === 0){
			delete this.listeners[event];
		}
		return this;
	});

	EventEmitter.method('trigger', function(event){
		var args = [].slice.call(arguments, 1);
		var listeners, index, total;
		var callbacks = this.listeners[event];
		var specialCallbacks = this.getWildcardListeners(event);
		if(callbacks){
			listeners = callbacks.slice();
			for(index = 0, total = listeners.length; index < total; ++index){
				if(listeners[index]){
					listeners[index].apply(listeners[index].__context, args);
				}else{
					break;
				}
			}
		}
		if(specialCallbacks){
			listeners = specialCallbacks.slice();
			for(index = 0, total = listeners.length; index < total; ++index){
				if(listeners[index]){
					listeners[index].apply(listeners[index].__context, [event].concat(args));
				}else{
					break;
				}
			}
		}
		return this;
	});

	EventEmitter.method('releaseGroup', function(groupName){
		for(var item in this.listeners){
			var handlers = this.listeners[item];
			for(var index = 0, total = handlers.length; index < total; index++){
				if(handlers[index].__groupName === groupName){
					delete handlers[index].__groupName;
					delete handlers[index].__context;
					handlers.splice(index, 1);
					index--;
					total--;
				}
			}
		}
		return this;
	});

	EventEmitter.method('getWildcardListeners', function(eventName){
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

	return EventEmitter;
});
