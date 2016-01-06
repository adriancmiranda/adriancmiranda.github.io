/* global Ambox */
(function(Ambox){

	// common patterns from projec
	Ambox.namespace('patterns', {
		objectAssessor:Ambox.Namespace.patterns.objectAssessor,
		startWith:Ambox.Namespace.patterns.startWith,
		isBoolAttr:/^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i,
		isTypedArray:/^((Uint8(Clamped)?)|(Uint16)|(Uint32)|(Int8)|(Int16)|(Int32)|(Float(32)|(64))Array)|ArrayBuffer$/,
		support3d:/^(css|matrix|rotate|scale|translate|transform(s)?)?3d$/,
		functionDeclaration:/^.*function\s([^\s]*|[^\(]*)\([^\x00]+$/,
		isXHRMethod:/^(get|post|head|put|delete|options)$/i,
		objectWrapper:/^(\[object(\s|\uFEFF|\xA0))|(\])$/g,
		cssMeasure:/^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/,
		noValue:/^(Undefined|Null|NaN)$/i,
		isBoolValue:/^(true|yes)$/gi,
		whiteSpace:(/\S+/g),
		jsonStart:/^\[|^\{(?!\{)/,
		jsonEnds:{'[':/\]$/, '{':/\}$/},
		jsonProtectionPrefix:/^\)\]\}',?\n/,
		findClass:function(className, modifiers){
			return new RegExp('(^|\\s+)'+ className +'(\\s+|$)', modifiers);
		},
		isExactly:function(group, modifiers){
			return new RegExp('^('+ group +')$', modifiers);
		},
		endsWith:function(symbol, modifiers){
			return new RegExp('\\'+ symbol +'$', modifiers);
		}
	});

}).call(this, Ambox);