define([
	'./Point',
	'../utils/Type',
	'../utils/Class'
], function(Point, Type, Class){
	'use strict';

	var Rectangle = new Class(function Rectangle(x, y, width, height){
		this.setTo(x, y, width, height);
	})

	.define('x|left', {
		set:function(value){
			this._x = Type.toFloat(value);
			this._left = this._x;
			this._right = this._x + this._width;
			this._topLeft = new Point(this._top, this._left);
			this._bottomRight = new Point(this._bottom, this._right);
		},
		get:function(){
			return this._x;
		}
	})
	
	.define('y|top', {
		set:function(value){
			this._y = Type.toFloat(value);
			this._top = this._y;
			this._bottom = this._y + this._height;
			this._topLeft = new Point(this._top, this._left);
			this._bottomRight = new Point(this._bottom, this._right);
		},
		get:function(){
			return this._y;
		}
	})
	
	.define('width', {
		set:function(value){
			this._width = Type.toFloat(value);
			this._right = this._x + this._width;
			this._bottomRight = new Point(this._bottom, this._right);
		},
		get:function(){
			return this._width;
		}
	})

	.define('height', {
		set:function(value){
			this._height = Type.toFloat(value);
			this._bottom = this._y + this._height;
			this._bottomRight = new Point(this._bottom, this._right);
		},
		get:function(){
			return this._height;
		}
	})

	.define('right', {
		get:function(){
			return this._right;
		}
	})

	.define('bottom', {
		get:function(){
			return this._bottom;
		}
	})

	.define('topLeft', {
		get:function(){
			return this._topLeft;
		}
	})

	.define('bottomRight', {
		get:function(){
			return this._bottomRight;
		}
	})

	.method('size', function(dw, dh){
		this.width = dw > 0? dw:0;
		this.height = dh > 0? dh:0;
		return this;
	})

	.method('offset', function(dx, dy){
		this.x = dx;
		this.y = dy;
		return this;
	})

	.method('setTo', function(x, y, width, height){
		return this.offset(x, y).size(width, height);
	})

	.method('union', function(rectangle){
		var x1 = Math.min(this.left, rectangle.left);
		var y1 = Math.min(this.top, rectangle.top);
		var x2 = Math.max(this.right, rectangle.right);
		var y2 = Math.max(this.bottom, rectangle.bottom);
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	})

	.method('inflate', function(dx, dy){
		return this.offset(this.x - dx, this.y - dy).size(this.width + 2 * dx, this.height + 2 * dy);
	})
	
	.method('inflatePoint', function(point){
		return this.inflate(point.x, point.y);
	})

	.method('setEmpty', function(point){
		return this.setTo(0, 0, 0, 0);
	})

	.method('isEmpty', function(){
		return this.width <= 0 || this.height <= 0;
	})

	.method('offsetPoint', function(point){
		return this.offset(point.x, point.y);
	})
	
	.method('intersects', function(rectangle){
		return this.left < rectangle.right && this.right > rectangle.left && this.top < rectangle.bottom && this.bottom > rectangle.top;
	})

	.method('intersection', function(rectangle){
		var x1 = Math.max(this.left, rectangle.left);
		var y1 = Math.max(this.top, rectangle.top);
		var x2 = Math.min(this.right, rectangle.right);
		var y2 = Math.min(this.bottom, rectangle.bottom);
		if(x2 >= x1 && y2 >= y1){
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		}
		return new Rectangle();
	})

	.method('intersectionArea', function(rectangle){
		return this.area() / rectangle.area();
	})

	.method('contains', function(x, y){
		return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
	})

	.method('containsPoint', function(point){
		return this.contains(point.x, point.y);
	})
	
	.method('containsRect', function(rectangle){
		return rectangle.left >= this.left && rectangle.right <= this.right && rectangle.top >= this.top && rectangle.bottom <= this.bottom;
	})

	.method('equals', function(rectangle){
		return this.topLeft.equals(rectangle.topLeft) && this.bottomRight.equals(rectangle.bottomRight);
	})

	.method('copyFrom', function(rectangle){
		return this.setTo(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	})

	.method('area', function(){
		return this.width * this.height;
	})

	.method('clone', function(){
		return new Rectangle(this.x, this.y, this.width, this.height);
	})

	.method('toString', function(){
		return '(x='+ this.x +', y='+ this.y +', width='+ this.width +', height='+ this.height +')';
	});

	return Rectangle;
});