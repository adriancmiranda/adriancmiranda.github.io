/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');

	var each = new Proto(function(object, callback){
		if(Type.isArrayLike(object)){
			return each.array(object, callback);
		}
		return each.object(object, callback);
	});

	each.static('object', function(object, callback){
		var i = 0, p = Type.toArray(arguments, 2);
		for(var k in object){
			if(callback.call(object[k], i++, object[k], k, p) === false){
				break;
			}
		}
		return object;
	});

	each.static('array', function(object, callback){
		for(var i = 0, l = object.length, p = Type.toArray(arguments, 2); i < l;){
			if(callback.call(object[i], i, object[i], i++, p) === false){
				break;
			}
		}
		return object;
	});

	scope.uri('each', each);

}).call(this, Ambox);