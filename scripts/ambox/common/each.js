/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');

	var each = new Proto(function(object, callback){
		if(Type.isObjectLike(object)){
			return each.property(object, callback);
		}
		return each.index(object, callback);
	});

	each.static('property', function(value, fn, ctx, getEnum){
		var ret, ctr, i = 0, map = [], isFn = Type.isFunction(value);
		for(var key in value){
			if(getEnum || value.hasOwnProperty(key)){
				ctr = isFn? key !== 'prototype' && key !== 'length' && key !== 'name' : true;
				ret = ctr && fn.call(ctx||value[key], value[key], key, i++, value);
				if(Type.isDefined(ret)){
					map.push(ret);
				}
			}
		}
		return map.length? map : [].concat(value);
	});

	each.static('index', function(value, fn, ctx){
		var map = [];
		for(var i = 0, l = value.length, ret; i < l;){
			ret = fn.call(ctx||value[i], value[i], i, i++, value);
			if(Type.isDefined(ret)){
				map.push(ret);
			}
		}
		return map.length? map : [].concat(value);
	});

	scope.uri('each', each);

}).call(this, Ambox);