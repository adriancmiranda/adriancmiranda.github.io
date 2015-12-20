define([
	'./Point',
	'./Rectangle',
	'../utils/Type',
	'../utils/Class'
], function(Point, Rectangle, Type, Class){

	// TODO: 
	// √ 1. Find midpoints AB, BC, CA
	// √ 2. Find slope AB, BC, CA
	// x 3. -1/slope
	// x 4. Y = mx + B
	// x 5. Set 2 equations equal to each other
	// --------------------------------------------------
	// O raio da circunferência inscrita é igual a 1/3 da altura do triângulo
	// --------------------------------------------------
	// https://en.wikipedia.org/wiki/Circumscribed_circle
	var Triangle = new Class(function Triangle(a, b, c, x, y){
		Class.proxyfy(this, 'draw').setTo(a, b, c, x, y);
	}).static('EPSILON', 0.000001);

	Triangle.define('x', {
		set:function(value){
			var changed = value !== this._x;
			this._x = Type.toFloat(value);
			this._a.x += this._x;
			this._b.x += this._x;
			this._c.x += this._x;
			changed && this.onChange && this.onChange(this, 'x', this._x);
		},
		get:function(){
			return this._x;
		}
	});

	Triangle.define('y', {
		set:function(value){
			var changed = value !== this._y;
			this._y = Type.toFloat(value);
			this._a.y += this._y;
			this._b.y += this._y;
			this._c.y += this._y;
			changed && this.onChange && this.onChange(this, 'y', this._y);
		},
		get:function(){
			return this._y;
		}
	});

	Triangle.define('a', {
		set:function(value){
			var changed = value !== this._a;
			this._a = value instanceof Point? value:new Point();
			this._a.onChange = this.draw;
			changed && this.onChange && this.onChange(this, 'a', this._a);
		},
		get:function(){
			return this._a;
		}
	});

	Triangle.define('b', {
		set:function(value){
			var changed = value !== this._b;
			this._b = value instanceof Point? value:new Point();
			this._b.onChange = this.draw;
			changed && this.onChange && this.onChange(this, 'b', this._b);
		},
		get:function(){
			return this._b;
		}
	});

	Triangle.define('c', {
		set:function(value){
			var changed = value !== this._c;
			this._c = value instanceof Point? value:new Point();
			this._c.onChange = this.draw;
			changed && this.onChange && this.onChange(this, 'c', this._c);
		},
		get:function(){
			return this._c;
		}
	});

	Triangle.define('onChange', {
		set:function(fn){
			this._onChange = Type.isFunction(fn)? fn:undefined;
		},
		get:function(){
			return this._onChange;
		}
	});

	Triangle.define('topLeft', {
		get:function(){
			return this._topLeft;
		}
	});

	Triangle.define('bottomRight', {
		get:function(){
			return this._bottomRight;
		}
	});

	Triangle.define('distanceAB', {
		get:function(){
			return this._distanceAB;
		}
	});

	Triangle.define('distanceBC', {
		get:function(){
			return this._distanceBC;
		}
	});

	Triangle.define('distanceCA', {
		get:function(){
			return this._distanceCA;
		}
	});

	Triangle.define('distancePointAB', {
		get:function(){
			return this._distancePointAB;
		}
	});

	Triangle.define('distancePointBC', {
		get:function(){
			return this._distancePointBC;
		}
	});

	Triangle.define('distancePointCA', {
		get:function(){
			return this._distancePointCA;
		}
	});

	Triangle.define('midpointAB', {
		get:function(){
			return this._midpointAB;
		}
	});

	Triangle.define('midpointBC', {
		get:function(){
			return this._midpointBC;
		}
	});

	Triangle.define('midpointCA', {
		get:function(){
			return this._midpointCA;
		}
	});

	Triangle.define('slopeAB', {
		get:function(){
			return this._slopeAB;
		}
	});

	Triangle.define('slopeBC', {
		get:function(){
			return this._slopeBC;
		}
	});

	Triangle.define('slopeCA', {
		get:function(){
			return this._slopeCA;
		}
	});

	Triangle.define('area', {
		get:function(){
			return this._area;
		}
	});

	Triangle.define('base', {
		get:function(){
			return this._base;
		}
	});

	Triangle.define('heightA', {
		get:function(){
			return this._heightA;
		}
	});

	Triangle.define('heightB', {
		get:function(){
			return this._heightB;
		}
	});

	Triangle.define('heightC', {
		get:function(){
			return this._heightC;
		}
	});

	Triangle.define('centroid', {
		get:function(){
			return this._centroid;
		}
	});

	Triangle.define('ortocenter', {
		get:function(){
			return this._ortocenter;
		}
	});

	Triangle.define('incenter', {
		get:function(){
			return this._incenter;
		}
	});

	Triangle.define('circuncenter', {
		get:function(){
			return this._circuncenter;
		}
	});

	Triangle.method('draw', function(){
		this._topLeft = Point.min(this.a, this.b, this.c);
		this._bottomRight = Point.max(this.a, this.b, this.c);
		this._distanceAB = this.b.distance(this.a);
		this._distanceBC = this.b.distance(this.c);
		this._distanceCA = this.c.distance(this.a);
		this._distancePointAB = this.b.distancePoint(this.a);
		this._distancePointBC = this.b.distancePoint(this.c);
		this._distancePointCA = this.c.distancePoint(this.a);
		this._midpointAB = this.a.midpoint(this.b);
		this._midpointBC = this.b.midpoint(this.c);
		this._midpointCA = this.c.midpoint(this.a);
		this._slopeAB = this.a.slope(this.b);
		this._slopeBC = this.b.slope(this.c);
		this._slopeCA = this.c.slope(this.a);
		this._area = Math.abs((this.a.x - this.c.x) * (this.b.y - this.a.y) - (this.a.x - this.b.x) * (this.c.y - this.a.y)) / 2;
		// this._base = 0;
		// this._heightA = 0;
		// this._heightB = 0;
		// this._heightC = 0;
		this._centroid = Point.centroid(this.a, this.b, this.c);
		// this._ortocenter = new Point();
		// this._incenter = new Point();
		// this._circuncenter = new Point();
	});

	Triangle.method('setTo', function(a, b, c, x, y){
		this.a = a;
		this.b = b;
		this.c = c;
		this.x = x;
		this.y = y;
		this.draw();
		return this;
	});

	Triangle.method('getBoundsRect', function(){
		return new Rectangle(this.topLeft.x, this.topLeft.y, this.topLeft.distanceX(this.bottomRight), this.topLeft.distanceY(this.bottomRight));
	});

	Triangle.method('equals', function(triangle){
		return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
	});

	Triangle.method('copyFrom', function(triangle){
		this.setTo(triangle.a, triangle.b, triangle.c, triangle.x, triangle.y);
	});

	Triangle.method('clone', function(){
		return new Triangle(this.a, this.b, this.c, this.x, this.y);
	});

	Triangle.method('toString', function(){
		return '(a='+ this.a.toString() +', b='+ this.b.toString() +', c='+ this.c.toString() +', x='+ this.x +', y='+ this.y +')';
	});

	return Triangle;
});