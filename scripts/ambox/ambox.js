(function(){

	function Scope(target){
		return Scope.register(target);
	}

	Scope.patterns = {
		objectAssessor: /\[(["']?)([^\1]+?)\1?\]/g,
		startWith:function(symbol, modifiers){
			return new RegExp('^\\'+ symbol, modifiers);
		}
	};

	Scope.pathArray = function(qualifiedName, slash){
		slash = typeof(slash) === 'string'? slash : '.';
		var objectAssessor = Scope.patterns.objectAssessor;
		var keys = qualifiedName.replace(objectAssessor, slash +'$2');
		keys = keys.replace(Scope.patterns.startWith(slash), '');
		return keys.split(slash);
	};

	Scope.register = function(target){
		target.uri = function(key, value){
			if(arguments.length === 1){
				return Scope.uri(target, key);
			}
			Scope.uri(target, key, value);
			return value;
		};
		return target;
	};

	Scope.preventDefault = function(target){
		return function(key){
			var piece = Scope.uri(target, key);
			return typeof(piece) === 'function'? piece.apply(target, arguments) : piece;
		};
	};

	Scope.overload = function(target, name, fn){
		var cache = target[name];
		target[name] = function(){//console.log(name, fn)
			if(fn.length === arguments.length){
				return fn.apply(this, arguments);
			}else if(typeof(cache) === 'function'){
				return cache.apply(this, arguments);
			}
		};
	};

	Scope.overload(Scope, 'uri', function(target, qualifiedName){
		var id = 0;
		var keys = Scope.pathArray(qualifiedName, '.');
		var total = keys.length;
		while((target = target[keys[id++]]) !== null && id < total){}
		return id < total? void(0) : target;
	});

	Scope.overload(Scope, 'uri', function(target, qualifiedName, value){
		var id = 0;
		var keys = Scope.pathArray(qualifiedName, '.');
		var root = target;
		var total = keys.length - 1;
		var isLikeObject;
		while(id < total){
			qualifiedName = keys[id++];
			isLikeObject = target[qualifiedName] === Object(target[qualifiedName]);
			target = target[qualifiedName] = isLikeObject? target[qualifiedName] : {};
		}
		if(typeof(value) === 'undefined'){
			delete(target[keys[id]]);
		}else{
			target[keys[id]] = value;
		}
		return root;
	});

	var namespace = 'Ambox';
	this[namespace] = this[namespace] || {};
	this.Ambox = Scope.register(this[namespace]);
	this.Ambox.Scope = Scope;
	this.Ambox.namespace = namespace;

}).call(this);