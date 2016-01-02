define([
	'../common/patterns'
], function(patterns){

	function Class(caste){
		if(this instanceof Class){
			var noop = function Class(){};
			var hasCaste = typeof(caste) === 'function';
			caste = hasCaste? caste:noop;
			caste.prototype.toString = this.toString;
			caste.prototype.flush = this.flush;
			caste.extends = this.extends;
			caste.method = this.method;
			caste.static = this.static;
			caste.charge = this.charge;
			caste.outrun = this.outrun;
			caste.define = this.define;
			caste.setter = this.setter;
			caste.getter = this.getter;
			return caste;
		}
		return new Class(caste);
	}

	Class.options = function(target){
		var params = Array.prototype.slice.call(arguments);
		var id, source, property;
		for(id = 1; id < params.length; id++){
			source = params[id];
			for(var property in source){
				if(Object.prototype.hasOwnProperty.call(source, property)){
					target[property] = source[property];
				}
			}
		}
		return target;
	};

	Class.proxyfy = function(context){
		var methods = Array.prototype.slice.call(arguments, 1);
		for(var id = 0; id < methods.length; id++){
			if(typeof context[methods[id]] === 'function'){
				context[methods[id]] = this.proxy(context[methods[id]], context);
			}
		}
		return context;
	};

	Class.proxy = function(fn, context){
		var args = Array.prototype.slice.call(arguments, 2);
		return function(){
			return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
		};
	};

	Class.browse = function(fn){
		return function(){
			return Function.call.apply(fn, arguments);
		};
	};

	Class.of = function(value, qualified){
		if(value){
			var type = Object.prototype.toString.call(value);
			if(qualified && type === '[object Object]'){
				return value.constructor.toString().replace(patterns.functionDeclaration, '$1') || 'Object';
			}
			return type.replace(patterns.objectWrapper, '');
		}
		return value;
	};

	Class.test = function(datatypes, value, qualified){
		var group = patterns.isExactly(datatypes, 'g');
		return group.test(this.of(value, qualified));
	};

	Class.create = (Object.create || function(prototype){
		function Class(){}
		Class.prototype = prototype;
		return new Class();
	});

	Class.prototype.extends = function(superclass){
		var hasSuper = typeof(superclass) === 'function';
		superclass = hasSuper ? superclass:Class;
		superclass = superclass.prototype;
		this.prototype = Class.create(superclass);
		this.prototype.constructor = this;
		this.prototype.super = superclass;
		return this;
	};

	Class.prototype.charge = function(name, fn){
		var cache = this.prototype[name];
		this.method(name, function(){
			if(fn.length === arguments.length){
				return fn.apply(this, arguments);
			}else if(typeof(cache) === 'function'){
				return cache.apply(this, arguments);
			}
		});
		return this;
	};

	Class.prototype.outrun = function(name, fn){
		var cache = this[name];
		this.static(name, function(){
			if(fn.length === arguments.length){
				return fn.apply(this, arguments);
			}else if(typeof(cache) === 'function'){
				return cache.apply(this, arguments);
			}
		});
	};

	Class.prototype.method = function(name, definition){
		if(typeof(name) === 'string'){
			this.prototype[name] = definition;
		}else if(Class.of(name) === 'Object'){
			for(var key in name){
				if(name.hasOwnProperty(key)){
					this.prototype[key] = name[key];
				}
			}
		}
		return this;
	};

	Class.prototype.static = function(name, definition){
		if(typeof(name) === 'string'){
			this[name] = definition;
		}else if(Class.of(name) === 'Object'){
			for(var key in name){
				if(name.hasOwnProperty(key)){
					this[key] = name[key];
				}
			}
		}
		return this;
	};

	Class.prototype.define = function(prop, definition){
		var definitions = {};
		var nameList = prop.split('|');
		for(var id=0, total=nameList.length; id<total; id++){
			definitions[nameList[id]] = definition;
		}
		Object.defineProperties(this.prototype, definitions);
		return this;
	};

	Class.prototype.setter = function(prop, definition){
		this.define(prop, { set:definition });
	};

	Class.prototype.getter = function(prop, definition){
		this.define(prop, { get:definition });
	};

	Class.prototype.flush = function(){
		for(var key in this){
			if(this.hasOwnProperty(key)){
				delete(this[key]);
			}
		}
	};

	Class.prototype.toString = function(){
		return '[object '+ Class.of(this, true) +']';
	};

	return Class;
});