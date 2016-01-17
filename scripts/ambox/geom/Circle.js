/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var Point = scope.uri('Point');

	// Circle
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var Circle = new Proto(function Circle(radius){
		// N/A yet.
	});

	Circle.define('perimeter|circumference', {
		get:function(){
			return this._perimeter;
		}
	});

	scope.uri('Circle', Circle);

}).call(this, Ambox);