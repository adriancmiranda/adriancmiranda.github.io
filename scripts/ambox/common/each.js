/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');

	var each = new Proto(function(object, callback){
		if(Type.isObjectLike(object)){
			return each.object(object, callback);
		}
		return each.array(object, callback);
	});

	each.static('object', function(obj, fn, ctx, getEnum){
		var i = 0;
		for(var key in obj){
			if(getEnum || obj.hasOwnProperty(key)){
				if(fn.call(ctx||obj[key], obj[key], key, i++, obj) === false){
					break;
				}
			}
		}
		return obj;
	});

	each.static('array', function(obj, fn, ctx){
		for(var i = 0, l = obj.length; i < l;){
			if(fn.call(ctx||obj[i], obj[i], i, i++, obj) === false){
				break;
			}
		}
		return obj;
	});

	scope.uri('each', each);

}).call(this, Ambox);