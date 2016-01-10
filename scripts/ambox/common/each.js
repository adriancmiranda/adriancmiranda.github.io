/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');

	var each = new Proto(function(object, callback, params){
		if(Type.isArrayLike(object)){
			return each.array(object, callback);
		}
		return each.object(object, callback);
	});

	each.static('object', function(object, callback){
		for(var key in object){
			if(callback.call(object[key], key, object[key]) === false){
				break;
			}
		}
		return object;
	});

	each.static('array', function(object, callback){
		for(var id = 0, total = object.length; id < total;){
			if(callback.call(object[id], id, object[id++]) === false){
				break;
			}
		}
		return object;
	});

	scope.uri('each', each);

}).call(this, Ambox);