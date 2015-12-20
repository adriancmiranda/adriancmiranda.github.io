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
	var Triangle = new Class(function Triangle(a, b, c){
		Class.proxyfy(this, 'draw').setTo(a, b, c);
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

	Triangle.define('width', {
		get:function(value){
			return this._width;
		}
	});

	Triangle.define('height', {
		get:function(value){
			return this._height;
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

	Triangle.define('boundsRect', {
		get:function(){
			return this._boundsRect;
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
		this._topLeft = Point.min(this._a, this._b, this._c);
		this._bottomRight = Point.max(this._a, this._b, this._c);
		this._width = this._topLeft.distanceX(this._bottomRight);
		this._height = this._topLeft.distanceY(this._bottomRight);
		this._boundsRect = new Rectangle(this._x, this._y, this._width, this._height);
		this._distanceAB = this._b.distance(this._a);
		this._distanceBC = this._b.distance(this._c);
		this._distanceCA = this._c.distance(this._a);
		this._distancePointAB = this._b.distancePoint(this._a);
		this._distancePointBC = this._b.distancePoint(this._c);
		this._distancePointCA = this._c.distancePoint(this._a);
		this._midpointAB = this._a.midpoint(this._b);
		this._midpointBC = this._b.midpoint(this._c);
		this._midpointCA = this._c.midpoint(this._a);
		this._slopeAB = this._a.slope(this._b);
		this._slopeBC = this._b.slope(this._c);
		this._slopeCA = this._c.slope(this._a);
		this._area = Math.abs((this._a.x - this._c.x) * (this._b.y - this._a.y) - (this._a.x - this._b.x) * (this._c.y - this._a.y)) / 2;
		// this._base = 0;
		// this._heightA = 0;
		// this._heightB = 0;
		// this._heightC = 0;
		this._centroid = Point.centroid(this._a, this._b, this._c);
		// this._ortocenter = new Point();
		// this._incenter = new Point();
		// this._circuncenter = new Point();
	});

	Triangle.method('setTo', function(a, b, c){
		this.a = a;
		this.b = b;
		this.c = c;
		this.x = 0;
		this.y = 0;
		this.draw();
		return this;
	});

	Triangle.method('getBoundsRect', function(){
		
	});

	Triangle.method('equals', function(triangle){
		return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
	});

	Triangle.method('copyFrom', function(triangle){
		this.setTo(triangle.a, triangle.b, triangle.c);
	});

	Triangle.method('clone', function(){
		return new Triangle(this.a, this.b, this.c);
	});

	Triangle.method('toString', function(){
		return '(a='+ this.a.toString() +', b='+ this.b.toString() +', c='+ this.c.toString() +', x='+ this.x +', y='+ this.y +')';
	});

	return Triangle;
});