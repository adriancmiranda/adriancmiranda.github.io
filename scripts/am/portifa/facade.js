define([
	'scope',
	'library/geom/Point',
	'library/geom/Triangle',
	'library/geom/Rectangle'
], function(scope, Point, Triangle, Rectangle){
	
	var t = new Triangle();
	console.log('distanceBA:', t.distanceBA)
	t.a.x = 1;
	t.onChange = function(triangle, property, value){
		console.log('changed to:', triangle, property, value);
	};
	t.a.x = 2;
	console.log('[scope.content.portifa]:', scope, t);
});