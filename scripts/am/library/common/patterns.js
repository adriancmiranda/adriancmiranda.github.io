define(function(){
	'use strict';

	return ({
		isBoolAttr:/^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i,
		support3d:/^(css|matrix|rotate|scale|translate|transform(s)?)?3d$/,
		functionDeclaration:/^.*function\s([^\s]*|[^\(]*)\([^\x00]+$/,
		objectWrapper:/^(\[object(\s|\uFEFF|\xA0))|(\])$/g,
		cssMeasure:/^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/,
		objectAssessor:/\[(["']?)([^\1]+?)\1?\]/g,
		noValue:/^(Undefined|Null|NaN)$/i,
		whiteSpace:(/\S+/g),
		findClass:function(className){
			return new RegExp('(^|\\s+)'+ className +'(\\s+|$)');
		},
		startWith:function(symbol){
			return new RegExp('^\\'+ symbol);
		}
	});
});