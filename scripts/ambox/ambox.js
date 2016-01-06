(function(){

	function Namespace(target){
		return Namespace.register(target);
	}

	Namespace.patterns = {
		objectAssessor: /\[(["']?)([^\1]+?)\1?\]/g,
		startWith:function(symbol, modifiers){
			return new RegExp('^\\'+ symbol, modifiers);
		}
	};

	Namespace.pathArray = function(qualifiedName, slash){
		slash = typeof(slash) === 'string'? slash : '.';
		var objectAssessor = Namespace.patterns.objectAssessor;
		var keys = qualifiedName.replace(objectAssessor, slash +'$2');
		keys = keys.replace(Namespace.patterns.startWith(slash), '');
		return keys.split(slash);
	};

	Namespace.register = function(target){
		target.namespace = function(key, value){
			if(arguments.length === 1){
				return Namespace.uri(target, key);
			}
			Namespace.uri(target, key, value);
			return value;
		};
		return target;
	};

	Namespace.preventDefault = function(target){
		return function(key){
			var piece = Namespace.uri(target, key);
			return typeof(piece) === 'function'? piece.apply(target, arguments) : piece;
		};
	};

	Namespace.overload = function(target, name, fn){
		var cache = target[name];
		target[name] = function(){
			if(fn.length === arguments.length){
				return fn.apply(this, arguments);
			}else if(typeof(cache) === 'function'){
				return cache.apply(this, arguments);
			}
		};
	};

	Namespace.overload(Namespace, 'uri', function(target, qualifiedName){
		var id = 0;
		var keys = Namespace.pathArray(qualifiedName, '.');
		var total = keys.length;
		while((target = target[keys[id++]]) !== null && id < total){}
		return id < total? void(0) : target;
	});

	Namespace.overload(Namespace, 'uri', function(target, qualifiedName, value){
		var id = 0;
		var keys = Namespace.pathArray(qualifiedName, '.');
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

	this.Ambox = this.Ambox || {};
	this.Ambox = Namespace.register(this.Ambox);
	this.Ambox.Namespace = Namespace;

}).call(this);