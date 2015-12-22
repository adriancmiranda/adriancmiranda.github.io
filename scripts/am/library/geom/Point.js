define([
	'../utils/Type',
	'../utils/Class'
], function(Type, Class){

	var Point = new Class(function Point(x, y){
		this.setTo(x, y);
	}).static('EPSILON', 0.00001);
	
	Point.define('x', {
		set:function(value){
			if(value === this._x){return;}
			this._x = Type.toFloat(value);
			this._length = Math.sqrt(this._x * this._x + this._y * this._y);
			this.onChange && this.onChange(this, 'x', this._x);
		},
		get:function(){
			return this._x;
		}
	});

	Point.define('y', {
		set:function(value){
			if(value === this._y){return;}
			this._y = Type.toFloat(value);
			this._length = Math.sqrt(this._x * this._x + this._y * this._y);
			this.onChange && this.onChange(this, 'y', this._y);
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

	Point.static('fromObject', function(value, x, y){
		return new Point(value[x] || value[0] || value.x || value.left, value[y] || value[1] || value.y || value.top);
	});

	Point.static('random', function(length, angle){
		return new Point(Math.random(), Math.random());
	});

	Point.static('polar', function(length, angle){
		return new Point(length * Math.cos(angle), length * Math.sin(angle));
	});

	Point.static('map', function(points, iterator){
		for(var id = 0; id < points.length; id++){
			points[id] instanceof Point && iterator(points[id], id);
		}
	});

	Point.static('min', function(/* ...point */){
		var points = Array.prototype.slice.call(arguments);
		var min = points[0] instanceof Point? points[0].clone():new Point();
		this.map(points, function(point){
			min.x = point.x < min.x? point.x:min.x;
			min.y = point.y < min.y? point.y:min.y;
		});
		return min;
	});

	Point.static('max', function(/* ...point */){
		var points = Array.prototype.slice.call(arguments);
		var max = points[0] instanceof Point? points[0].clone():new Point();
		this.map(points, function(point){
			max.x = point.x > max.x? point.x:max.x;
			max.y = point.y > max.y? point.y:max.y;
		});
		return max;
	});

	Point.static('centroid', function(/* ...point */){
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

	Point.method('setTo', function(x, y){
		this.x = x;
		this.y = y;
		return this;
	});

	Point.method('offset', function(dx, dy){
		return this.setTo(this.x + dx, this.x + dy);
	});

	Point.method('radians', function(){
		return Math.atan2(this.y, this.x);
	});

	Point.method('degrees', function(){
		return this.radians() * 180 / Math.PI;
	});

	Point.method('cross', function(point){
		return this.x * point.y - this.y - point.x;
	});

	Point.method('dot', function(point){
		return this.x * point.x + this.y * point.y;
	});

	Point.method('project', function(point){
		var scale = this.dot(point) / point.dot(point);
		return new Point(point.x * scale, point.y * scale);
	});

	Point.method('direction', function(point){
		var angleV = Math.acos((point.x - this.x) / this.distance(point));
		angleV = (this.y - point.y > 0)? -angleV:angleV;
		return (angleV + Math.PI * 2);
	});

	Point.method('distanceX', function(point){
		return Math.abs(this.x - point.x);
	});

	Point.method('distanceY', function(point){
		return Math.abs(this.y - point.y);
	});
	
	Point.method('distancePoint', function(point){
		return new Point(this.distanceX(point), this.distanceY(point));
	});

	Point.method('distanceSquared', function(point){
		return Math.pow(this.distanceX(point), 2) + Math.pow(this.distanceY(point), 2);
	});

	Point.method('distance', function(point){
		return Math.sqrt(this.distanceSquared(point));
	});

	Point.method('manhattanDistance', function(point){
		return this.distanceX(point) + this.distanceY(point);
	});

	Point.method('slope', function(point){
		return this.distanceY(point) / this.distanceX(point);
	});

	Point.method('perpendicularSlope', function(point){
		return -1 / this.slope(point);
	});

	Point.method('midpoint', function(point){
		return new Point((this.x + point.x) * 0.5, (this.y + point.y) * 0.5);
	});

	Point.method('min', function(point){
		return new Point(Math.min(this.x, point.x), Math.min(this.y, point.y));
	});

	Point.method('max', function(point){
		return new Point(Math.max(this.x, point.x), Math.max(this.y, point.y));
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

	Point.method('negate', function(point){
		return new Point(-this.x, -this.y);
	});

	Point.method('interpolate', function(point, f){
		return new Point(point.x + (this.x - point.x) * f, point.y + (this.y - point.y) * f);
	});

	Point.method('normalize', function(thickness){
		thickness = Type.isNumeric(thickness)? Type.toFloat(thickness):1;
		return this.setTo(this.x / this.length * thickness, this.y / this.length * thickness);
	});

	Point.method('isParallelTo', function(point){
		return Math.abs(this.x / point.x - this.y / point.y) < Point.EPSILON;
	});

	Point.method('isInsideFrom', function(rectangle){
		return rectangle.containsPoint(this);
	});

	Point.method('isCloseFrom', function(point, tolerance){
		return this.distance(point) < tolerance;
	});

	Point.method('setZero', function(){
		return this.setTo(0, 0);
	});

	Point.method('isZero', function(){
		return this.x === 0 && this.y === 0;
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

	Point.method('toString', function(){
		return '(x='+ this.x +', y='+ this.y +')';
	});

	return Point;
});