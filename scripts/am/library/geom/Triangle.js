define([
	'./Point',
	'./Rectangle',
	'../utils/Type',
	'../utils/Class'
], function(Point, Rectangle, Type, Class){

	// TODO: 
	// 1. Find midpoints AB, BC, CA
	// 2. Find slope AB, BC, CA
	// 3. -1/slope
	// 4. Y = mx + B
	// 5. Set 2 equations equal to each other
	var Triangle = new Class(function Triangle(a, b, c){
		this.draw = this.draw.bind(this);
		this.setTo(a, b, c);
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

	Triangle.method('draw', function(){
		this.distanceBA = this.b.distancePointTo(this.a);
		this.distanceCA = this.c.distancePointTo(this.a);
		// this.area = 0;
		// this.apothem = new Rectangle();
		// this.centroid = new Point((this.a.x + this.b.x + this.c.x) * 0.33333, (this.a.y + this.b.y + this.c.y) * 0.33333);// O raio da circunferência inscrita é igual a 1/3 da altura do triângulo
		// this.ortocenter = new Point();
		// this.incenter = new Point();
		// this.circuncenter = new Point();
		this.radius = null;
	});

	Triangle.method('setTo', function(a, b, c){
		this.a = a;
		this.b = b;
		this.c = c;
		this.draw();
		return this;
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