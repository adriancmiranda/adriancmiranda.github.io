/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var Point = scope.uri('Point');
	var Rectangle = scope.uri('Rectangle');

	// Triangle
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	// TODO to find Circuncircle:
	// √ 1. Find midpoints AB, BC, CA
	// √ 2. Find slope AB, BC, CA
	// x 3. -1/slope
	// x 4. Y = mx + B
	// x 5. Set 2 equations equal to each other
	// --------------------------------------------------
	// O raio da circunferência inscrita é igual a 1/3 da altura do triângulo
	// --------------------------------------------------
	// https://en.wikipedia.org/wiki/Circumscribed_circle
	// --------------------------------------------------
	// TODO to find orthocenter using coordinates:
	// √ 1. Find slope AB, BC, CA
	// x - Opposite reciprocal
	// x 2. Point-slope form: y = m(x - h) + k
	var Triangle = new Class(function Triangle(a, b, c){
		Class.proxyfy(this, 'draw').setTo(a, b, c);
	}).static('EPSILON', 0.000001);

	Triangle.define('x', {
		set:function(value){
			if(value === this._x){return;}
			this._x = Type.toFloat(value);
			this._a.x += this._x;
			this._b.x += this._x;
			this._c.x += this._x;
			this.onChange && this.onChange(this, 'x', this._x);
		},
		get:function(){
			return this._x;
		}
	});

	Triangle.define('y', {
		set:function(value){
			if(value === this._y){return;}
			this._y = Type.toFloat(value);
			this._a.y += this._y;
			this._b.y += this._y;
			this._c.y += this._y;
			this.onChange && this.onChange(this, 'y', this._y);
		},
		get:function(){
			return this._y;
		}
	});

	Triangle.define('width', {
		get:function(){
			return this._width;
		}
	});

	Triangle.define('height', {
		get:function(){
			return this._height;
		}
	});

	Triangle.define('boundsRect', {
		get:function(){
			return this._boundsRect;
		}
	});

	Triangle.define('a', {
		set:function(value){
			if(value === this._a){return;}
			this._a = value instanceof Point? value:new Point();
			this._a.onChange = this.draw;
			this.onChange && this.onChange(this, 'a', this._a);
		},
		get:function(){
			return this._a;
		}
	});

	Triangle.define('b', {
		set:function(value){
			if(value === this._b){return;}
			this._b = value instanceof Point? value:new Point();
			this._b.onChange = this.draw;
			this.onChange && this.onChange(this, 'b', this._b);
		},
		get:function(){
			return this._b;
		}
	});

	Triangle.define('c', {
		set:function(value){
			if(value === this._c){return;}
			this._c = value instanceof Point? value:new Point();
			this._c.onChange = this.draw;
			this.onChange && this.onChange(this, 'c', this._c);
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

	Triangle.define('topRight', {
		get:function(){
			return this._topRight;
		}
	});

	Triangle.define('bottomLeft', {
		get:function(){
			return this._bottomLeft;
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

	Triangle.define('minimalDistance', {
		get:function(){
			if(this._minimalDistance === 0){
				// There are no angles to draw and exit
				// to avoid divide by zero in direction function
				return;
			}
			return this._minimalDistance;// get the angle arc radius 1/5th
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

	Triangle.define('perpendicularSlopeAB', {
		get:function(){
			return this._perpendicularSlopeAB;
		}
	});

	Triangle.define('perpendicularSlopeBC', {
		get:function(){
			return this._perpendicularSlopeBC;
		}
	});

	Triangle.define('perpendicularSlopeCA', {
		get:function(){
			return this._perpendicularSlopeCA;
		}
	});

	Triangle.define('perimeter', {
		get:function(){
			return this._perimeter;
		}
	});

	Triangle.define('semiperimeter', {
		get:function(){
			return this._semiperimeter;
		}
	});

	Triangle.define('area', {
		get:function(){
			return this._area;
		}
	});

	Triangle.define('area2', {
		get:function(){
			return this._area2;
		}
	});

	Triangle.define('altitudeA|heightA', {
		get:function(){
			return this._altitudeA;
		}
	});

	Triangle.define('altitudeB|heightB', {
		get:function(){
			return this._altitudeB;
		}
	});

	Triangle.define('altitudeC|heightC', {
		get:function(){
			return this._altitudeC;
		}
	});

	Triangle.define('angleA', {
		get:function(){
			return this._angleA;
		}
	});

	Triangle.define('angleB', {
		get:function(){
			return this._angleB;
		}
	});

	Triangle.define('angleC', {
		get:function(){
			return this._angleC;
		}
	});

	Triangle.define('barycenter|centroid', {
		get:function(){
			return this._centroid;
		}
	});

	Triangle.define('orthocenter', {
		get:function(){
			return this._orthocenter;
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
		this._topRight = new Point(this._bottomRight.x, this._topLeft.y);
		this._bottomLeft = new Point(this._topLeft.x, this._bottomRight.y);
		this._width = this._topLeft.distanceX(this._bottomRight);
		this._height = this._topLeft.distanceY(this._bottomRight);
		this._boundsRect = new Rectangle(this._topLeft.x, this._topLeft.y, this._width, this._height);
		this._distanceAB = this._a.distance(this._b);
		this._distanceBC = this._b.distance(this._c);
		this._distanceCA = this._c.distance(this._a);
		this._minimalDistance = Math.min(this._distanceAB, this._distanceBC, this._distanceCA);
		this._maximalDistance = Math.max(this._distanceAB, this._distanceBC, this._distanceCA);
		// this._directionAB = this._a.direction(this._b);
		// this._directionBC = this._b.direction(this._c);
		// this._directionCA = this._c.direction(this._a);
		// this._sweepAngleAB = ;
		// this._sweepAngleBC = ;
		// this._sweepAngleCA = ;
		this._distancePointAB = this._a.distancePoint(this._b);
		this._distancePointBC = this._b.distancePoint(this._c);
		this._distancePointCA = this._c.distancePoint(this._a);
		this._midpointAB = this._a.midpoint(this._b);
		this._midpointBC = this._b.midpoint(this._c);
		this._midpointCA = this._c.midpoint(this._a);
		this._slopeAB = this._a.slope(this._b);
		this._slopeBC = this._b.slope(this._c);
		this._slopeCA = this._c.slope(this._a);
		this._perpendicularSlopeAB = this._a.perpendicularSlope(this._b);
		this._perpendicularSlopeBC = this._b.perpendicularSlope(this._c);
		this._perpendicularSlopeCA = this._c.perpendicularSlope(this._a);
		this._perimeter = this._distanceAB + this._distanceBC + this._distanceCA;
		this._semiperimeter = this._perimeter / 2;
		this._area = Math.abs((this._a.x - this._c.x) * (this._b.y - this._a.y) - (this._a.x - this._b.x) * (this._c.y - this._a.y)) / 2;
		this._area2 = this._area * 2;
		this._centroid = new Point((this._a.x + this._b.x + this._c.x) / 3, (this._a.y + this._b.y + this._c.y) / 3);
		this._altitudeA = this._area2 / this._distanceAB;
		this._altitudeB = this._area2 / this._distanceBC;
		this._altitudeC = this._area2 / this._distanceCA;

		// y = m(x - h) + k
		// this._altitudeA = this._perpendicularSlopeAB * (x - this._c.x) + this._c.y;
		// this._altitudeB = this._perpendicularSlopeBC * (x - this._a.x) + this._a.y;
		// this._altitudeC = this._perpendicularSlopeCA * (x - this._b.x) + this._b.y;

		// The length of side a is the difference between point 1 and point 2's x (horizonal) axis.
		var a = this._distancePointAB.x;

		// The length of side b is the difference between point 2 and point 3's y (veritcal axis)
		var b = this._distancePointBC.y;

		// Too find the length of the last side c, we must use the pythagorean theorem.
		// c * c = a * a + b * b
		// square side a and b, and add the result.  Then find the square root of the result.
		var c = Math.sqrt(((a * a) + (b * b)));

		// We must use the Cosine rule to solve the triangles 3 angles.
		// c^2 = a^2 + b^2 - c^2
		var A = Math.acos((((c * c) + (b * b) - (a * a)) / (2 * c * b)) * Math.PI / 180);
		var B = Math.acos((((c * c) + (a * a) - (b * b)) / (2 * a * c)) * Math.PI / 180);
		var C = Math.acos((((a * a) + (b * b) - (c * c)) / (2 * a * b)) * Math.PI / 180);

		// console.log(a, b, c, '->', A, B, C)
		// console.log('dirs:', this._directionAB, this._directionBC, this._directionCA)

		// SSS Triangles
		this._angleA = A;
		// https://en.wikipedia.org/wiki/Law_of_cosines
		this._angleB = B//Math.acos(Math.pow(this._distanceAB, 2) + Math.pow(this._distanceBC, 2) - Math.pow(this._distanceCA, 2) / (2 * this._distanceAB * this._distanceBC));
		// console.log(Math.pow(this._distanceAB, 2), 'a:', this._a.toString(), 'b:', this._b.toString(), this._a.distance(this._b), this._distanceAB);
		// console.log(Math.pow(this._distanceBC, 2), 'b:', this._b.toString(), 'c:', this._c.toString(), this._b.distance(this._c), this._distanceBC);
		// console.log(Math.pow(this._distanceCA, 2), 'c:', this._c.toString(), 'a:', this._a.toString(), this._c.distance(this._a), this._distanceCA);
		this._angleC = C;


		function bla(ax,ay,az, bx,by,bz, cx,cy,cz){
			// (A²+B²-c²)
			return (ax*by*cz + ay*bz*cx + az*bx*cy) - (ax*bz*cy + ay*bx*cz + az*by*cx);
		}

		// https://en.wikipedia.org/wiki/Altitude_(triangle)#Orthocenter
		this._orthocenter = new Point(
			bla(
				-(this._b.x * this._c.x) - (this._a.y * this._a.y)/*ax*/, this._a.y/*ay*/, 1,
				-(this._c.x * this._a.x) - (this._b.y * this._b.y)/*bx*/, this._b.y/*by*/, 1,
				-(this._a.x * this._b.x) - (this._c.y * this._c.y)/*cx*/, this._c.y/*cy*/, 1
			) / -this._area2,
			bla(
				this._a.x/*ax*/, -(this._a.x * this._a.x) - (this._b.y * this._c.y)/*ay*/, 1,
				this._b.x/*bx*/, -(this._b.x * this._b.x) - (this._c.y * this._a.y)/*by*/, 1,
				this._c.x/*cx*/, -(this._c.x * this._c.x) - (this._a.y * this._b.y)/*cy*/, 1
			) / -this._area2
		);

		console.log('orthocenter:', this._orthocenter.toString());

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

	Triangle.method('inCircumcircle', function(point){
		return false;
	});

	Triangle.method('inOrthocircle', function(point){
		return false;
	});

	Triangle.method('inCentercircle', function(point){
		return false;
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

	scope.uri('Triangle', Triangle);

}).call(this, Ambox);