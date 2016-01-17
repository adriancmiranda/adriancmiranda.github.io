/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');

	// Point
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var Point = new Proto(function Point(x, y){
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
		var min = points[0] instanceof Point? points[0].clone():new Point(0, 0);
		this.map(points, function(point){
			min.x = point.x < min.x? point.x:min.x;
			min.y = point.y < min.y? point.y:min.y;
		});
		return min;
	});

	Point.static('max', function(/* ...point */){
		var points = Array.prototype.slice.call(arguments);
		var max = points[0] instanceof Point? points[0].clone():new Point(0, 0);
		this.map(points, function(point){
			max.x = point.x > max.x? point.x:max.x;
			max.y = point.y > max.y? point.y:max.y;
		});
		return max;
	});

	Point.static('centroid', function(/* ...point */){
		var points = Array.prototype.slice.call(arguments);
		var centroid = new Point(0, 0);
		this.map(points, function(point){
			centroid.x += point.x;
			centroid.y += point.y;
		});
		centroid.x /= points.length;
		centroid.y /= points.length;
		return centroid;
	});

	Point.public('setTo', function(x, y){
		this.x = x||0;
		this.y = y||0;
		return this;
	});

	Point.public('offset', function(dx, dy){
		return this.setTo(this.x + dx, this.x + dy);
	});

	Point.public('radians', function(){
		return Math.atan2(this.y, this.x);
	});

	Point.public('degrees', function(){
		return this.radians() * 180 / Math.PI;
	});

	Point.public('cross', function(point){
		return this.x * point.y - this.y - point.x;
	});

	Point.public('dot', function(point){
		return this.x * point.x + this.y * point.y;
	});

	Point.public('project', function(point){
		var scale = this.dot(point) / point.dot(point);
		return new Point(point.x * scale, point.y * scale);
	});

	Point.public('direction', function(point){
		var angleV = Math.acos((point.x - this.x) / this.distance(point));
		return (((this.y - point.y > 0)? -angleV:angleV) + Math.PI * 2);// % (Math.PI * 2);
	});

	Point.public('distanceX', function(point){
		return Math.abs(this.x - point.x);
	});

	Point.public('distanceY', function(point){
		return Math.abs(this.y - point.y);
	});

	Point.public('distancePoint', function(point){
		return new Point(this.distanceX(point), this.distanceY(point));
	});

	Point.public('distanceSquared', function(point){
		return Math.pow(this.distanceX(point), 2) + Math.pow(this.distanceY(point), 2);
	});

	Point.public('distance', function(point){
		return Math.sqrt(this.distanceSquared(point));
	});

	Point.public('manhattanDistance', function(point){
		return this.distanceX(point) + this.distanceY(point);
	});

	Point.public('slope', function(point){
		return this.distanceY(point) / this.distanceX(point);
	});

	Point.public('perpendicularSlope', function(point){
		return Type.toFloat(-1 / this.slope(point));
	});

	Point.public('midpoint', function(point){
		return new Point((this.x + point.x) * 0.5, (this.y + point.y) * 0.5);
	});

	Point.public('min', function(point){
		return new Point(Math.min(this.x, point.x), Math.min(this.y, point.y));
	});

	Point.public('max', function(point){
		return new Point(Math.max(this.x, point.x), Math.max(this.y, point.y));
	});

	Point.public('add', function(point){
		return new Point(this.x + point.x, this.y + point.y);
	});

	Point.public('subtract', function(point){
		return new Point(this.x - point.x, this.y - point.y);
	});

	Point.public('multiply', function(point){
		return new Point(this.x * point.x, this.y * point.y);
	});

	Point.public('divide', function(point){
		return new Point(this.x / point.x, this.y / point.y);
	});

	Point.public('modulo', function(point){
		return new Point(this.x % point.x, this.y % point.y);
	});

	Point.public('round', function(){
		return new Point(Math.round(this.x), Math.round(this.y));
	});

	Point.public('ceil', function(){
		return new Point(Math.ceil(this.x), Math.ceil(this.y));
	});

	Point.public('floor', function(){
		return new Point(Math.floor(this.x), Math.floor(this.y));
	});

	Point.public('abs', function(){
		return new Point(Math.abs(this.x), Math.abs(this.y));
	});

	Point.public('negate', function(point){
		return new Point(-this.x, -this.y);
	});

	Point.public('interpolate', function(point, f){
		return new Point(point.x + (this.x - point.x) * f, point.y + (this.y - point.y) * f);
	});

	Point.public('normalize', function(thickness){
		thickness = Type.isNumeric(thickness)? Type.toFloat(thickness):1;
		return this.setTo(this.x / this.length * thickness, this.y / this.length * thickness);
	});

	Point.public('isParallelTo', function(point){
		return Math.abs(this.x / point.x - this.y / point.y) < Point.EPSILON;
	});

	Point.public('isInsideFrom', function(rectangle){
		return rectangle.containsPoint(this);
	});

	Point.public('isCloseFrom', function(point, tolerance){
		return this.distance(point) < tolerance;
	});

	Point.public('setZero', function(){
		return this.setTo(0, 0);
	});

	Point.public('isZero', function(){
		return this.x === 0 && this.y === 0;
	});

	Point.public('equals', function(point){
		return(point.x === this.x && point.y === this.y);
	});

	Point.public('copyFrom', function(point){
		return this.setTo(point.x, point.y);
	});

	Point.public('clone', function(){
		return new Point(this.x, this.y);
	});

	Point.public('toString', function(){
		return '(x='+ this.x +', y='+ this.y +')';
	});

	scope.uri('Point', Point);

}).call(this, Ambox);