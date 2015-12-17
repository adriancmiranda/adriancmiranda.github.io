define([
	'./Type',
	'./Class',
	'../common/patterns'
], function(Type, Class, patterns){

	var Scope = new Class(function Scope(instance){
		return Scope.register(instance);
	});

	Scope.static('pathArray', function(qualifiedName, slash){
		slash = Type.isString(slash)? slash:'.';
		var keys = qualifiedName.replace(patterns.objectAssessor, slash +'$2');
		keys = keys.replace(patterns.startWith(slash), '');
		return keys.split(slash);
	});

	Scope.static('register', function(instance){
		return function(key, value){
			Scope.uri(instance, key, value);
			return value;
		};
	});

	Scope.static('run', function(instance){
		return function(key){
			var piece = Scope.uri(instance, key);
			var params = Array.prototype.slice.call(arguments, 1);
			return typeof piece === 'function'? piece.apply(instance, params):piece;
		};
	});
	
	Scope.outrun('uri', function(instance, qualifiedName){
		var id = 0;
		var keys = this.pathArray(qualifiedName, '.');
		var total = keys.length;
		while((instance = instance[keys[id++]]) !== null && id < total){}
		return id < total? void 0:instance;
	});

	Scope.outrun('uri', function(instance, qualifiedName, value){
		var id = 0;
		var keys = this.pathArray(qualifiedName, '.');
		var root = instance;
		var total = keys.length - 1;
		while(id < total){
			qualifiedName = keys[id++];
			instance = instance[qualifiedName] = Type.isObject(instance[qualifiedName])? instance[qualifiedName]:{};
		}
		instance[keys[id]] = value;
		return root;
	});

	return Scope;
});