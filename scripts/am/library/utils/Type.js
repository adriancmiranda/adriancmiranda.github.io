define([
	'./Class',
	'../common/patterns'
], function(Class, patterns){

	var Type = new Class(function Type(value, qualified){
		return Class.of(value, qualified);
	});
window.Type = Type;
	Type.static('toArray', function(value, slice){
		if(!value){return [];}
		value = Object(value);
		if('toArray' in value){
			return value.toArray().slice(slice);
		}
		var length = value.length || 0;
		var results = new Array(length);
		while(length--){
			results[length] = value[length];
		}
		return results.slice(slice);
	});

	Type.static('toCSSMeasure', function(value){
		if(this.isNumeric(Number(value)) && value){
			return value+'px';
		}
		return this.isCSSMeasure(value)? value:0;
	});

	Type.static('toBoolean', function(value){
		if(this.isString(value) && !this.isNumeric(value)){
			return patterns.isBoolValue.test(value);
		}
		return !!value;
	});
	
	Type.static('toFloat', function(value){
		value = parseFloat(value, 10);
		return this.isNumeric(value)? value:0;
	});

	Type.static('toUint', function(value){
		value = this.toInt(value);
		return value < 0? 0:value;
	});

	Type.static('toInt', function(value){
		return 0 | parseInt(value, 10);
	});

	Type.static('toJSON', function(value, replacer, pretty){
		pretty = this.isUint(pretty)? pretty:null;
		if(this.isDefined(value)){
			return JSON.stringify(value, replacer, pretty);
		}
	});

	Type.static('fromJSON', function(json){
		return this.isString(json)? JSON.parse(json):json;
	});

	Type.static('isJSONLike', function(value){
		if(this.isString(value)){
			var start = value.match(patterns.jsonStart);
			return!!(start && patterns.jsonEnds[start[0]].test(value));
		}
		return false;
	});

	Type.static('isArrayLike', function(value){
		if(!Class.of(value) || !this.isNumber(value.length)){
			return false;
		}
		if(!this.isFunction(value.hasOwnProperty) && !this.isFunction(value.constructor)){
			return true;
		}
		return !this.isObject(value) || this.isFunction(value.callee);
	});

	Type.static('isEmptyObject', function(value){
		for(var name in value){
			return false;
		}
		return this.isObject(value);
	});

	Type.static('isTypedArray', function(value){
		return patterns.isTypedArray.test(Class.of(value));
	});

	Type.static('isCSSMeasure', function(value){
		return patterns.cssMeasure.test(value);
	});

	Type.static('isNumeric', function(value){
		return !isNaN(parseFloat(value)) && isFinite(value);
	});
	
	Type.static('isInt', function(value){
		return parseFloat(value, 10) === parseInt(value, 10);
	});
	
	Type.static('isUint', function(value){
		return this.isInt(value) && value >= 0;
	});
	
	Type.static('isNode', function(value){
		return value && value.nodeName && this.isUint(value.nodeType) && value.nodeType && value.nodeType < 13;
	});

	Type.static('isNodeElement', function(value){
		return this.isNode(value) && (value.nodeType === 1 || value.nodeType === 11);
	});
	
	Type.static('isDocument', function(value){
		return this.isNode(value) && value.nodeType === 9;
	});

	Type.static('isObjectLike', function(value){
		return value === Object(value);
	});

	Type.static('isDate', function(value){
		return Class.of(value) === 'Date';
	});

	Type.static('isRegExp', function(value){
		return Class.of(value) === 'RegExp';
	});

	Type.static('isObject', function(value){
		return Class.of(value) === 'Object';
	});

	Type.static('isFile', function(value){
		return Class.of(value, true) === 'File';
	});

	Type.static('isFormData', function(value){
		return Class.of(value, true) === 'FormData';
	});

	Type.static('isBlob', function(value){
		return Class.of(value, true) === 'Blob';
	});
	
	Type.static('isWindow', function(value){
		return Class.of(value) === 'global';
	});

	Type.static('isString', function(value){
		return typeof(value) === 'string';
	});

	Type.static('isNumber', function(value){
		return typeof(value) === 'number';
	});

	Type.static('isBoolean', function(value){
		return typeof(value) === 'boolean';
	});

	Type.static('isFunction', function(value){
		return typeof(value) === 'function';
	});

	Type.static('isUndefined', function(value){
		return typeof(value) === 'undefined';
	});

	Type.static('isDefined', function(value){
		return typeof(value) !== 'undefined';
	});
	
	Type.static('isNull', function(value){
		return value === null;
	});

	Type.static('isArray', Array.isArray);

	return Type;
});