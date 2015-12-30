define([
	'./Type',
	'./Class'
], function(Type, Class){

	var Map = new Class(function Map(value, iterator, context, getEnum){
		if(Type.isArrayLike(value)){
			return Map.array(value, iterator, context);
		}else if(Type.isObject(value)){
			return Map.object(value, iterator, context, getEnum);
		}
		return [];
	});

	Map.static('array', function(value, iterator, context){
		var returns, map = [];
		if(value && value.forEach === Array.prototype.forEach){
			value.forEach(function(item, index, raw){
				returns = iterator.call(context, item, index, raw);
				if(Type.isDefined(returns)){
					map.push(returns);
				}
			});
		}else{
			for(var key = 0; Type.isArrayLike(value) && key < value.length; key++){
				returns = iterator.call(context, value[key], key, value);
				if(Type.isDefined(returns)){
					map.push(returns);
				}
			}
		}
		map.last = map[map.length - 1];
		return map.length? map:[].concat(value);
	});

	Map.static('object', function(value, iterator, context, getEnum){
		var key, control, isStatic = Type.isFunction(value);
		var returns, map = [];
		for(key in value){
			if(getEnum || value.hasOwnProperty(key)){
				control = isStatic? key !== 'prototype' && key !== 'length' && key !== 'name':true;
				returns = control && iterator.call(context, value[key], key, value);
				if(Type.isDefined(returns)){
					map.push(returns);
				}
			}
		}
		map.last = map[map.length - 1];
		return map.length? map:[].concat(value);
	});

	Map.static('keys', Object.keys || function(value, getEnum){
		var keys = [];
		for(var key in value){
			if(getEnum || value.hasOwnProperty(key)){
				keys.push(key);
			}
		}
		return keys;
	});

	Map.static('inArray', function(value, searchValue, fromIndex){
		var from, size;
		if(Array.prototype.indexOf){
			return value.indexOf(searchValue, Type.toFloat(fromIndex));
		}
		size = value.length >>> 0;
		from = this.mod(Type.toInt(fromIndex), 0, size - 1);
		for(; from < size; from++){
			if(from in value && value[from] === searchValue){
				return from;
			}
		}
		return -1;
	});

	Map.static('mod', function(index, min, max){
		max = max + 1;
		index = index % max;
		return((index < min) ? (index + max) : index);
	});
	
	Map.static('bound', function(index, min, max){
		return((index > max) ? max : (index < min ? min : index));
	});

	return Map;
});
