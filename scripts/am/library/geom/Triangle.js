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

	Triangle.define('distanceAB', {
		get:function(){
			return this._distanceAB;
		}
	});

	Triangle.define('distanceCA', {
		get:function(){
			return this._distanceCA;
		}
	});

	Triangle.define('distanceBC', {
		get:function(){
			return this._distanceBC;
		}
	});

	Triangle.define('distancePointAB', {
		get:function(){
			return this._distancePointAB;
		}
	});

	Triangle.define('distancePointCA', {
		get:function(){
			return this._distancePointCA;
		}
	});

	Triangle.define('distancePointBC', {
		get:function(){
			return this._distancePointBC;
		}
	});

	Triangle.define('midpointAB', {
		get:function(){
			return this._midpointAB;
		}
	});

	Triangle.define('midpointCA', {
		get:function(){
			return this._midpointCA;
		}
	});

	Triangle.define('midpointBC', {
		get:function(){
			return this._midpointBC;
		}
	});

	Triangle.define('slopeAB', {
		get:function(){
			return this._slopeAB;
		}
	});

	Triangle.define('slopeCA', {
		get:function(){
			return this._slopeCA;
		}
	});

	Triangle.define('slopeBC', {
		get:function(){
			return this._slopeBC;
		}
	});

	Triangle.define('centroid', {
		get:function(){
			return this._centroid;
		}
	});

	Triangle.define('area', {
		get:function(){
			return this._area;
		}
	});

	Triangle.method('draw', function(){
		this._distanceAB = this.b.distanceTo(this.a);
		this._distanceCA = this.c.distanceTo(this.a);
		this._distanceBC = this.b.distanceTo(this.c);
		this._distancePointAB = this.b.distancePointTo(this.a);
		this._distancePointCA = this.c.distancePointTo(this.a);
		this._distancePointBC = this.b.distancePointTo(this.c);
		this._midpointAB = this.a.midpointTo(this.b);
		this._midpointCA = this.c.midpointTo(this.a);
		this._midpointBC = this.b.midpointTo(this.c);
		this._slopeAB = this.a.slopeTo(this.b);
		this._slopeCA = this.c.slopeTo(this.a);
		this._slopeBC = this.b.slopeTo(this.c);
		this._centroid = Point.centroid(this.a, this.b, this.c);
		this._area = Math.abs((this.a.x - this.c.x) * (this.b.y - this.a.y) - (this.a.x - this.b.x) * (this.c.y - this.a.y)) * 0.5;
		// this.apothem = new Rectangle();
		// this.incenter = new Point();
		// this.circuncenter = new Point();
		// this.ortocenter = new Point();
		this.radius = null;
	});

	Triangle.method('setTo', function(a, b, c){
		this.a = a;
		this.b = b;
		this.c = c;
		this.draw();
		return this;
	});

	public double findArea(double sideA, double sideB, double sideC)
    { 
        s = 1/2 * (sideA + sideB + sideC);
        area = Math.sqrt(s*(s-sideA)*(s-sideB)*(s-sideC));
        System.out.println("The area of the triangle is " + area);
        return area;
    }

	Triangle.method('getBoundsRect', function(){
		var topLeft = Point.min(this.a, this.b, this.c);
		var bottomRight = Point.max(this.a, this.b, this.c);
		return new Rectangle(topLeft.x, topLeft.y, topLeft.distanceX(bottomRight), topLeft.distanceY(bottomRight));
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
		return '(a='+ this.a.toString() +', b='+ this.b.toString() +', c='+ this.c.toString() +')';
	});

	return Triangle;
});