define([
	'../utils/Type',
	'../utils/Class'
], function(Type, Class){

	var Point = new Class(function Point(x, y){
		this.setTo(x, y);
	});
	
	Point.define('x', {
		set:function(value){
			var changed = value !== this._x;
			this._x = Type.toFloat(value);
			this._length = Math.sqrt(this._x * this._x + this._y * this._y);
			changed && this.onChange && this.onChange(this, 'x', this._x);
		},
		get:function(){
			return this._x;
		}
	});

	Point.define('y', {
		set:function(value){
			var changed = value !== this._y;
			this._y = Type.toFloat(value);
			this._length = Math.sqrt(this._x * this._x + this._y * this._y);
			changed && this.onChange && this.onChange(this, 'y', this._y);
		},
		get:function(){
			return this._y;
		}
	});

	Point.define('length', {
		get:function(){
			return this._length;
		}
	});

	Point.define('onChange', {
		set:function(fn){
			this._onChange = Type.isFunction(fn)? fn:undefined;
		},
		get:function(){
			return this._onChange;
		}
	});

	Point.static('fromObject', function(obj){
		return new Point(obj.x, obj.y);
	});

	Point.static('fromArray', function(arr){
		return new Point(arr[0], arr[1]);
	});

	Point.static('min', function(){
		var points = Array.prototype.slice.call(arguments);
		var min = points[0] instanceof Point? points[0].clone():new Point();
		this.map(points, function(point){
			min.x = point.x < min.x? point.x:min.x;
			min.y = point.y < min.y? point.y:min.y;
		});
		return min;
	});

	Point.static('max', function(){
		var points = Array.prototype.slice.call(arguments);
		var max = points[0] instanceof Point? points[0].clone():new Point();
		this.map(points, function(point){
			max.x = point.x > max.x? point.x:max.x;
			max.y = point.y > max.y? point.y:max.y;
		});
		return max;
	});

	Point.static('centroid', function(){
		var points = Array.prototype.slice.call(arguments);
		var centroid = new Point();
		this.map(points, function(point){
			centroid.x += point.x;
			centroid.y += point.y;
		});
		centroid.x /= points.length;
		centroid.y /= points.length;
		return centroid;
	});

	Point.static('map', function(points, iterator){
		for(var id = 0; id < points.length; id++){
			points[id] instanceof Point && iterator(points[id], id);
		}
	});

	Point.static('polar', function(length, angle){
		return new Point(length * Math.cos(angle), length * Math.sin(angle));
	});

	Point.static('distance', function(pointA, pointB){
		return pointA.distanceTo(pointB);
	});

	Point.static('slope', function(pointA, pointB){
		return pointA.slopeTo(pointB);
	});

	Point.static('interpolate', function(pointA, pointB, f){
		return pointA.interpolate(pointB, f);
	});

	Point.method('setTo', function(x, y){
		this.x = x;
		this.y = y;
		return this;
	});

	Point.method('interpolate', function(point, f){
		return new Point(point.x + (this.x - point.x) * f, point.y + (this.y - point.y) * f);
	});

	Point.method('normalize', function(thickness){
		thickness = Type.isNumeric(thickness)? Type.toFloat(thickness):1;
		this.x = this.x / this.length * thickness;
		this.y = this.y / this.length * thickness;
		return this;
	});

	Point.method('add', function(point){
		return new Point(this.x + point.x, this.y + point.y);
	});

	Point.method('subtract', function(point){
		return new Point(this.x - point.x, this.y - point.y);
	});

	Point.method('multiply', function(point){
		return new Point(this.x * point.x, this.y * point.y);
	});

	Point.method('divide', function(point){
		return new Point(this.x / point.x, this.y / point.y);
	});

	Point.method('modulo', function(point){
		return new Point(this.x % point.x, this.y % point.y);
	});

	Point.method('negate', function(point){
		return new Point(-this.x, -this.y);
	});

	Point.method('round', function(){
		return new Point(Math.round(this.x), Math.round(this.y));
	});

	Point.method('ceil', function(){
		return new Point(Math.ceil(this.x), Math.ceil(this.y));
	});

	Point.method('floor', function(){
		return new Point(Math.floor(this.x), Math.floor(this.y));
	});

	Point.method('abs', function(){
		return new Point(Math.abs(this.x), Math.abs(this.y));
	});

	Point.method('offset', function(dx, dy){
		return this.setTo(this.x + dx, this.x + dy);
	});

	Point.method('distanceX', function(point){
		return Math.abs(this.x - point.x);
	});

	Point.method('distanceY', function(point){
		return Math.abs(this.y - point.y);
	});

	Point.method('midpointTo', function(point){
		return new Point((this.x + point.x) * 0.5, (this.y + point.y) * 0.5);
	});

	Point.method('slopeTo', function(point){
		var distancePoint = this.distancePointTo(point);
		return distancePoint.y / distancePoint.x;
	});

	Point.method('distancePointTo', function(point){
		return new Point(this.distanceX(point), this.distanceY(point));
	});

	Point.method('distanceTo', function(point){
		return Math.sqrt(Math.pow(this.distanceX(point), 2) + Math.pow(this.distanceY(point), 2));
	});

	Point.method('manhattan', function(point){
		return this.distanceX(point) + this.distanceY(point);
	});

	Point.method('equals', function(point){
		return(point.x === this.x && point.y === this.y);
	});

	Point.method('copyFrom', function(point){
		return this.setTo(point.x, point.y);
	});

	Point.method('clone', function(){
		return new Point(this.x, this.y);
	});

	Point.method('toRadians', function(dx, dy){
		dx = this.x - dx;
		dy = this.y - dy;
		return Math.atan2(dx, dy);
	});

	Point.method('toDegrees', function(dx, dy){
		var angle = this.toRadians(dx, dy);
		return angle * (180 / Math.PI);
	});

	Point.method('toString', function(){
		return '(x='+ this.x +', y='+ this.y +')';
	});
	
	return Point;
});