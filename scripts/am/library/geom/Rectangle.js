define([
	'./Point',
	'../utils/Type',
	'../utils/Class'
], function(Point, Type, Class){
	'use strict';

	var Rectangle = new Class(function Rectangle(x, y, width, height){
		this.setTo(x, y, width, height);
	});

	Rectangle.define('x|left', {
		set:function(value){
			this._x = Type.toFloat(value);
			this._left = this._x;
			this._right = this._x + this._width;
			this._topLeft = new Point(this._left, this._top);
			this._bottomRight = new Point(this._right, this._bottom);
		},
		get:function(){
			return this._x;
		}
	});
	
	Rectangle.define('y|top', {
		set:function(value){
			this._y = Type.toFloat(value);
			this._top = this._y;
			this._bottom = this._y + this._height;
			this._topLeft = new Point(this._left, this._top);
			this._bottomRight = new Point(this._right, this._bottom);
		},
		get:function(){
			return this._y;
		}
	});
	
	Rectangle.define('width', {
		set:function(value){
			this._width = Type.toFloat(value);
			this._right = this._x + this._width;
			this._bottomRight = new Point(this._right, this._bottom);
		},
		get:function(){
			return this._width;
		}
	});

	Rectangle.define('height', {
		set:function(value){
			this._height = Type.toFloat(value);
			this._bottom = this._y + this._height;
			this._bottomRight = new Point(this._right, this._bottom);
		},
		get:function(){
			return this._height;
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

	Rectangle.method('setEmpty', function(point){
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
		var x1 = Math.max(this.left, rectangle.left);
		var y1 = Math.max(this.top, rectangle.top);
		var x2 = Math.min(this.right, rectangle.right);
		var y2 = Math.min(this.bottom, rectangle.bottom);
		if(x2 >= x1 && y2 >= y1){
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		}
		return new Rectangle();
	});

	Rectangle.method('intersectionArea', function(rectangle){
		return this.area() / rectangle.area();
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

	Rectangle.method('area', function(){
		return this.width * this.height;
	});

	Rectangle.method('clone', function(){
		return new Rectangle(this.x, this.y, this.width, this.height);
	});

	Rectangle.method('toString', function(){
		return '(x='+ this.x +', y='+ this.y +', width='+ this.width +', height='+ this.height +')';
	});

	return Rectangle;
});