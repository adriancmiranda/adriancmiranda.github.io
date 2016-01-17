/* global Ambox */
(function(scope){
	var patterns = scope.uri('patterns');

	// Type
	// @role `typeof` and `instanceof` shortcuts normalized
	// @see http://caniuse.com/#search=JSON
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	function Type(value, qualified){
		return Type.of(value, qualified);
	}

	Type.of = function(value, qualified){
		if(value){
			var type = Object.prototype.toString.call(value);
			if(qualified && type === '[object Object]'){
				return value.constructor.toString().replace(patterns.functionDeclaration, '$1') || 'Object';
			}
			return type.replace(patterns.objectWrapper, '');
		}
		return value;
	};

	Type.test = function(datatypes, value, qualified){
		var group = patterns.isExactly(datatypes, 'g');
		return group.test(Type.of(value, qualified));
	};


	// Number
	// ======

	Type.isNumber = function(value){
		return typeof(value) === 'number';
	};

	Type.isNumeric = function(value){
		return !isNaN(parseFloat(value)) && isFinite(value);
	};

	Type.isUint = function(value){
		return this.isInt(value) && value >= 0;
	};

	Type.isInt = function(value){
		return parseFloat(value, 10) === parseInt(value, 10);
	};

	Type.toFloat = function(value){
		value = parseFloat(value, 10);
		return this.isNumeric(value)? value:0;
	};

	Type.toUint = function(value){
		value = this.toInt(value);
		return value < 0? 0:value;
	};

	Type.toInt = function(value){
		return 0 | parseInt(value, 10);
	};


	// String/Object/JSON
	// ==================

	Type.isString = function(value){
		return typeof(value) === 'string';
	};

	Type.isObject = function(value){
		return Type.of(value) === 'Object';
	};

	Type.isEmptyObject = function(value){
		for(var name in value){return false;}
		return this.isObject(value);
	};

	Type.isObjectLike = function(value){
		return value === Object(value);
	};

	Type.isJsonLike = function(value){
		if(this.isString(value)){
			var start = value.match(patterns.jsonStart);
			return!!(start && patterns.jsonEnds[start[0]].test(value));
		}
		return false;
	};

	Type.fromJson = function(json){
		return this.isString(json)? JSON.parse(json):json;
	};

	Type.toJson = function(value, replacer, pretty){
		pretty = this.isUint(pretty)? pretty:null;
		if(this.isDefined(value)){
			return JSON.stringify(value, replacer, pretty);
		}
	};


	// Element
	// =======

	Type.isWindow = function(value){
		return Type.of(value) === 'global';
	};

	Type.isNode = function(value){
		return value && value.nodeName && this.isUint(value.nodeType) && value.nodeType && value.nodeType < 13;
	};

	Type.isNodeElement = function(value){
		return this.isNode(value) && (value.nodeType === 1 || value.nodeType === 11);
	};

	Type.isDocument = function(value){
		return this.isNode(value) && value.nodeType === 9;
	};

	Type.toCSSMeasure = function(value){
		if(this.isNumeric(Number(value)) && value){
			return value+'px';
		}
		return this.isCSSMeasure(value)? value:0;
	};

	Type.isCSSMeasure = function(value){
		return patterns.cssMeasure.test(value);
	};


	// Array
	// =====

	Type.isArray = Array.isArray;

	Type.isTypedArray = function(value){
		return patterns.isTypedArray.test(Type.of(value));
	};

	Type.isArrayLike = function(value){
		if(!value || !this.isNumeric(value.length)){
			return false;
		}
		if(!this.isFunction(value.hasOwnProperty) && !this.isFunction(value.constructor)){
			return true;
		}
		return !this.isObject(value) || this.isFunction(value.callee);
	};

	Type.toArray = function(value, slice){
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
	};


	// Null
	// ====

	Type.isUndefined = function(value){
		return typeof(value) === 'undefined';
	};

	Type.isDefined = function(value){
		return typeof(value) !== 'undefined';
	};

	Type.isNull = function(value){
		return value === null;
	};


	// Boolean
	// =======

	Type.isBoolean = function(value){
		return typeof(value) === 'boolean';
	};

	Type.toBoolean = function(value){
		if(this.isString(value) && !this.isNumeric(value)){
			return patterns.isBoolValue.test(value);
		}
		return !!value;
	};


	// Date
	// ====

	Type.isDate = function(value){
		return Type.of(value) === 'Date';
	};


	// RegExp
	// ======

	Type.isRegExp = function(value){
		return Type.of(value) === 'RegExp';
	};


	// Function
	// ========

	Type.isFunction = function(value){
		return typeof(value) === 'function';
	};

	scope.uri('Type', Type);

}).call(this, Ambox);