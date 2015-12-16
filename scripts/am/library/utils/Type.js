define([
	'./Class',
	'../common/patterns'
], function(Class, patterns){
	'use strict';

	var Type = new Class(function Type(value){
		return Type.of(value);
	});

	Type.static('isArray', Array.isArray);

	Type.static('isDate', function(value){
		return this.of(value) === 'date';
	});

	Type.static('isRegExp', function(value){
		return this.of(value) === 'regexp';
	});

	Type.static('isBoolean', function(value){
		return this.of(value) === 'boolean';
	});

	Type.static('isNumeric', function(value){
		return !isNaN(parseFloat(value)) && isFinite(value);
	});

	Type.static('isString', function(value){
		return typeof value === 'string';
	});

	Type.static('isObject', function(value){
		return this.of(value) === 'object';
	});

	Type.static('isNumber', function(value){
		return typeof value === 'number';
	});

	Type.static('isInt', function(value){
		return parseFloat(value, 10) === parseInt(value, 10);
	});

	Type.static('isUint', function(value){
		return this.isInt(value) && value >= 0;
	});

	Type.static('isCSSMeasure', function(value){
		return patterns.cssMeasure.test(value);
	});

	Type.static('isFunction', function(value){
		return typeof value === 'function';
	});

	Type.static('isNull', function(value){
		return value === null;
	});

	Type.static('isUndefined', function(value){
		return typeof value === 'undefined';
	});

	Type.static('isDefined', function(value){
		return typeof value !== 'undefined';
	});

	Type.static('isFile', function(value){
		return this.of(value, true) === 'file';
	});

	Type.static('isDOM', function(value){
		return value && value.nodeName && this.isUint(value.nodeType) && value.nodeType && value.nodeType < 13;
	});

	Type.static('isWindow', function(value){
		return this.of(value) === 'global';
	});

	Type.static('isDocument', function(value){
		return this.isDOM(value) && value.nodeType === 9;
	});

	Type.static('isElement', function(value){
		return this.isDOM(value) && (value.nodeType === 1 || value.nodeType === 11);
	});

	Type.static('isEmptyObject', function(value){
		var name;
		for(name in value){
			return false;
		}
		return this.isObject(value);
	});

	Type.static('isArrayLike', function(value){
		if(!this.of(value) || !this.isNumber(value.length)){
			return false;
		}
		if(!this.isFunction(value.hasOwnProperty) && !this.isFunction(value.constructor)){
			return true;
		}
		return !this.isObject(value) || this.isFunction(value.callee);
	});

	Type.static('toArray', function(value){
		var length, results;
		if(!value){
			return [];
		}
		value = Object(value);
		if('toArray' in value){
			return value.toArray();
		}
		length = value.length || 0;
		results = new Array(length);
		while(length--){
			results[length] = value[length];
		}
		return results;
	});

	Type.static('toInt', function(value){
		return 0 | parseInt(value, 10);
	});

	Type.static('toUint', function(value){
		value = this.toInt(value);
		return value < 0 ? 0 : value;
	});

	Type.static('toFloat', function(value){
		value = parseFloat(value, 10);
		return this.isNumeric(value) ? value : 0;
	});

	Type.static('toBoolean', function(value){
		if(this.isString(value) && !this.isNumeric(value)){
			return /^(true|yes)$/gi.test(value);
		}
		return !!value;
	});

	Type.static('toCSSMeasure', function(value){
		if(this.isNumeric(Number(value)) && value){
			return value+'px';
		}
		return this.isCSSMeasure(value) ? value : 0;
	});

	Type.static('getObjectDefinitionName', function(value){
		var type = ({}.toString).call(value).replace(patterns.objectWrapper, '');
		type = type === 'Number' && isNaN(value) ? value.toString() : type;
		return patterns.noValue.test(type) ? value : type;
	});

	Type.static('getQualifiedDefinitionName', function(value){
		var definition = this.getObjectDefinitionName(value);
		return(definition === 'Object' && value.constructor.toString().replace(patterns.functionDeclaration, '$1') || definition);
	});

	Type.static('getDefinitionName', function(value, qualified){
		return(qualified ? this.getQualifiedDefinitionName(value) : this.getObjectDefinitionName(value));
	});

	Type.static('of', function(value, qualified){
		var definition = this.getDefinitionName(value, qualified);
		return definition ? definition.toLowerCase() : definition;
	});

	Type.static('test', function(datatypes, value, qualified){
		var kindGroup = new RegExp('^('+ datatypes +')$', 'g');
		return kindGroup.test(this.of(value, qualified));
	});

	return Type;
});
