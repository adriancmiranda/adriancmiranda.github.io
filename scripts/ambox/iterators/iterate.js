/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');

	// iterate
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var iterate = new Proto(function(object, callback){
		if(Type.isObjectLike(object)){
			return iterate.property(object, callback);
		}
		return iterate.index(object, callback);
	});

	iterate.static('property', function(value, fn, ctx, getEnum){
		var ctr, i = 0, isFn = Type.isFunction(value);
		for(var key in value){
			if(getEnum || value.hasOwnProperty(key)){
				ctr = isFn? key !== 'prototype' && key !== 'length' && key !== 'name' : true;
				if((ctr && fn.call(ctx||value[key], value[key], key, i++, value)) === false){
					break;
				}
			}
		}
	});

	iterate.static('index', function(value, fn, ctx){
		for(var i = 0, l = value.length; i < l;){
			if(fn.call(ctx||value[i], value[i], i, i++, value) === false){
				break;
			}
		}
	});

	scope.uri('iterate', iterate);

}).call(this, Ambox);