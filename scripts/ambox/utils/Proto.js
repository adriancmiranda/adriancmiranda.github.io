/* global Ambox */
(function(Ambox){
	var Type = Ambox.namespace('Type');

	// Proto (Ecma5)
	// @role An extensible program-code-template for creating objects
	// @support IE10+, FF4-20+, SF5.1.4+, CH5+, OP11.60-OP12+, iOS7/8, Android4.4+
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>

	// Object.defineProperties
	// IE9+, FF4-20+, Webkit, SF5+, CH5+, OP11.60-OP12+, Konq4.13+, Android4.0+, iOS7/8
	// @see http://kangax.github.io/compat-table/es5/#test-Object.defineProperties

	// Object.defineProperty
	// IE8[1], IE9+, FF4-20+, SF5[2], SF5.1.4+, CH5+, OP11.60-OP12+, Konq4.13+, Android4.0+, iOS7/8
	// [1] In Internet Explorer 8 Object.defineProperty only accepts DOM objects
	// [2] In some versions of Safari 5, Object.defineProperty does not work with DOM objects.
	// @see http://kangax.github.io/compat-table/es5/#test-Object.defineProperty

	// Function.prototype.bind
	// IE9[2], IE10+, Android4.3[2], Android4.4+, OP5.0-8.0[2]
	// [2] Does not support Strict mode
	// @see http://caniuse.com/#search=Function.prototype.bind

	// Function.prototype.length
	// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length
	// @see https://github.com/Fyrd/caniuse/issues/2201

	function Proto(caste){
		if(this instanceof Proto){
			var noop = function Proto(){};
			var hasCaste = Type.isFunction(caste);
			caste = hasCaste? caste : noop;
			caste.prototype.toString = this.toString;
			caste.prototype.flush = this.flush;
			caste.extends = this.extends;
			caste.public = this.public;
			caste.static = this.static;
			caste.charge = this.charge;
			caste.outrun = this.outrun;
			return caste;
		}
		return new Proto(caste);
	}

	Proto.merge = function(target){
		var params = Type.toArray(arguments);
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

	Proto.rebind = function(context){
		var methods = Type.toArray(arguments, 1);
		for(var id = 0; id < methods.length; id++){
			if(Type.isFunction(context[methods[id]])){
				context[methods[id]] = this.bind(context[methods[id]], context);
			}
		}
		return context;
	};

	Proto.bind = (Function.prototype.bind || function(fn, context){
		var args = Type.toArray(arguments, 2);
		return function(){
			return fn.apply(context, args.concat(Type.toArray(arguments)));
		};
	});

	Proto.browse = function(fn){
		return function(){
			return Function.call.apply(fn, arguments);
		};
	};

	Proto.create = (Object.create || function(prototype){
		function Proto(){}
		Proto.prototype = prototype;
		return new Proto();
	});

	Proto.prototype.extends = function(superProto){
		var hasSuper = Type.isFunction(superProto);
		superProto = hasSuper? superProto : Proto;
		superProto = superProto.prototype;
		this.prototype = Proto.create(superProto);
		this.prototype.constructor = this;
		this.prototype.super = superProto;
		return this;
	};

	Proto.prototype.charge = function(name, fn){
		Ambox.Namespace.overload(this.prototype, name, fn);
		return this;
	};

	Proto.prototype.outrun = function(name, fn){
		Ambox.Namespace.overload(this, name, fn);
		return this;
	};

	Proto.prototype.public = function(name, definition){
		if(Type.isString(name)){
			this.prototype[name] = definition;
		}else if(Type.isObjectLike(name)){
			for(var key in name){
				if(name.hasOwnProperty(key)){
					this.prototype[key] = name[key];
				}
			}
		}
		return this;
	};

	Proto.prototype.static = function(name, definition){
		if(Type.isString(name)){
			this[name] = definition;
		}else if(Type.isObjectLike(name)){
			for(var key in name){
				if(name.hasOwnProperty(key)){
					this[key] = name[key];
				}
			}
		}
		return this;
	};

	Proto.prototype.flush = function(){
		for(var key in this){
			if(this.hasOwnProperty(key)){
				delete(this[key]);
			}
		}
	};

	Proto.prototype.toString = function(){
		return '[object '+ Type.of(this, true) +']';
	};

	Ambox.namespace('Proto', Proto);

}).call(this, Ambox);