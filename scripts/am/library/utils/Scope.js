define([
	'./Type',
	'./Class',
	'../common/patterns'
], function(Type, Class, patterns){

	var Scope = new Class(function Scope(namespace){
		return Scope.register(namespace);
	});

	Scope.static('pathArray', function(qualifiedName, slash){
		slash = Type.isString(slash)? slash:'.';
		var keys = qualifiedName.replace(patterns.objectAssessor, slash +'$2');
		keys = keys.replace(patterns.startWith(slash), '');
		return keys.split(slash);
	});

	Scope.static('register', function(namespace){
		return function(key, value){
			if(arguments.length === 1){
				return Scope.uri(namespace, key);
			}
			Scope.uri(namespace, key, value);
			return value;
		};
	});

	Scope.static('preventDefault', function(namespace){
		return function(key){
			var piece = Scope.uri(namespace, key);
			var params = Type.toArray(arguments, 1);
			return Type.isFunction(piece)? piece.apply(namespace, params):piece;
		};
	});
	
	Scope.outrun('uri', function(namespace, qualifiedName){
		var id = 0;
		var keys = this.pathArray(qualifiedName, '.');
		var total = keys.length;
		while((namespace = namespace[keys[id++]]) !== null && id < total){}
		return id < total? void(0):namespace;
	});

	Scope.outrun('uri', function(namespace, qualifiedName, value){
		var id = 0;
		var keys = this.pathArray(qualifiedName, '.');
		var root = namespace;
		var total = keys.length - 1;
		while(id < total){
			qualifiedName = keys[id++];
			namespace = namespace[qualifiedName] = Type.isGenericObject(namespace[qualifiedName])? namespace[qualifiedName]:{};
		}
		if(Type.isUndefined(value)){
			delete(namespace[keys[id]]);
		}else{
			namespace[keys[id]] = value;
		}
		return root;
	});

	return Scope;
});