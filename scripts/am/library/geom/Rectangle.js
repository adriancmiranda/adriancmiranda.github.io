define([
	'./Point',
	'../utils/Type',
	'../utils/Class'
], function(Point, Type, Class){

	var Rectangle = new Class(function Rectangle(x, y, width, height){
		this.setTo(x, y, width, height);
	});

	Rectangle.define('x', {
		set:function(value){
			var changed = value !== this._x;
			this._x = Type.toFloat(value);
			this._left = this._x;
			this._right = this._x + this._width;
			this._topLeft = new Point(this._left, this._top);
			this._bottomRight = new Point(this._right, this._bottom);
			this._centroid = Point.centroid(this._topLeft, this._bottomRight);
			changed && this.onChange && this.onChange(this, 'x', this._x);
		},
		get:function(){
			return this._x;
		}
	});
	
	Rectangle.define('y', {
		set:function(value){
			var changed = value !== this._y;
			this._y = Type.toFloat(value);
			this._top = this._y;
			this._bottom = this._y + this._height;
			this._topLeft = new Point(this._left, this._top);
			this._bottomRight = new Point(this._right, this._bottom);
			this._centroid = Point.centroid(this._topLeft, this._bottomRight);
			changed && this.onChange && this.onChange(this, 'y', this._y);
		},
		get:function(){
			return this._y;
		}
	});
	
	Rectangle.define('width', {
		set:function(value){
			var changed = value !== this._width;
			this._width = Type.toFloat(value);
			this._right = this._x + this._width;
			this._bottomRight = new Point(this._right, this._bottom);
			this._area = this._width * this._height;
			this._centroid = Point.centroid(this._topLeft, this._bottomRight);
			changed && this.onChange && this.onChange(this, 'width', this._width);
		},
		get:function(){
			return this._width;
		}
	});

	Rectangle.define('height', {
		set:function(value){
			var changed = value !== this._height;
			this._height = Type.toFloat(value);
			this._bottom = this._y + this._height;
			this._bottomRight = new Point(this._right, this._bottom);
			this._area = this._width * this._height; 
			this._centroid = Point.centroid(this._topLeft, this._bottomRight);
			changed && this.onChange && this.onChange(this, 'height', this._height);
		},
		get:function(){
			return this._height;
		}
	});

	Rectangle.define('area', {
		get:function(){
			return this._area;
		}
	});

	Rectangle.define('left', {
		get:function(){
			return this._left;
		}
	});

	Rectangle.define('top', {
		get:function(){
			return this._top;
		}
	});

	Rectangle.define('right', {
		get:function(){
			return this._right;
		}
	});

	Rectangle.define('bottom', {
		get:function(){
			return this._bottom;
		}
	});

	Rectangle.define('topLeft', {
		get:function(){
			return this._topLeft;
		}
	});

	Rectangle.define('bottomRight', {
		get:function(){
			return this._bottomRight;
		}
	});

	Rectangle.define('centroid', {
		get:function(){
			return this._centroid;
		}
	});

	Rectangle.define('onChange', {
		set:function(fn){
			this._onChange = Type.isFunction(fn)? fn:undefined;
		},
		get:function(){
			return this._onChange;
		}
	});

	Rectangle.static('fromObject', function(obj){
		return new Rectangle(obj.x, obj.y, obj.width, obj.height);
	});

	Rectangle.static('fromArray', function(arr){
		return new Rectangle(arr[0], arr[1], arr[2], arr[3]);
	});

	Rectangle.method('size', function(dw, dh){
		this.width = dw > 0? dw:0;
		this.height = dh > 0? dh:0;
		return this;
	});

	Rectangle.method('offset', function(dx, dy){
		this.x = dx;
		this.y = dy;
		return this;
	});

	Rectangle.method('setTo', function(x, y, width, height){
		return this.offset(x, y).size(width, height);
	});

	Rectangle.method('union', function(rectangle){
		var x1 = Math.min(this.topLeft.x, rectangle.topLeft.x);
		var y1 = Math.min(this.topLeft.y, rectangle.topLeft.y);
		var x2 = Math.max(this.bottomRight.x, rectangle.bottomRight.x);
		var y2 = Math.max(this.bottomRight.y, rectangle.bottomRight.y);
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	});

	Rectangle.method('inflate', function(dx, dy){
		return this.offset(this.x - dx, this.y - dy).size(this.width + 2 * dx, this.height + 2 * dy);
	});
	
	Rectangle.method('inflatePoint', function(point){
		return this.inflate(point.x, point.y);
	});

	Rectangle.method('setEmpty', function(){
		return this.setTo(0, 0, 0, 0);
	});

	Rectangle.method('isEmpty', function(){
		return this.width <= 0 || this.height <= 0;
	});

	Rectangle.method('offsetPoint', function(point){
		return this.offset(point.x, point.y);
	});
	
	Rectangle.method('intersects', function(rectangle){
		return this.left < rectangle.right && this.right > rectangle.left && this.top < rectangle.bottom && this.bottom > rectangle.top;
	});

	Rectangle.method('intersection', function(rectangle){
		var x1 = Math.max(this.topLeft.x, rectangle.topLeft.x);
		var y1 = Math.max(this.topLeft.y, rectangle.topLeft.y);
		var x2 = Math.min(this.bottomRight.x, rectangle.bottomRight.x);
		var y2 = Math.min(this.bottomRight.y, rectangle.bottomRight.y);
		if(x2 >= x1 && y2 >= y1){
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		}
		return new Rectangle();
	});

	Rectangle.method('intersectionArea', function(rectangle){
		return this.area / rectangle.area;
	});

	Rectangle.method('contains', function(x, y){
		return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
	});

	Rectangle.method('containsPoint', function(point){
		return this.contains(point.x, point.y);
	});
	
	Rectangle.method('containsRect', function(rectangle){
		return rectangle.left >= this.left && rectangle.right <= this.right && rectangle.top >= this.top && rectangle.bottom <= this.bottom;
	});

	Rectangle.method('equals', function(rectangle){
		return this.topLeft.equals(rectangle.topLeft) && this.bottomRight.equals(rectangle.bottomRight);
	});

	Rectangle.method('copyFrom', function(rectangle){
		return this.setTo(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	});

	Rectangle.method('clone', function(){
		return new Rectangle(this.x, this.y, this.width, this.height);
	});

	Rectangle.method('toString', function(){
		return '(x='+ this.x +', y='+ this.y +', width='+ this.width +', height='+ this.height +')';
	});

	return Rectangle;
});