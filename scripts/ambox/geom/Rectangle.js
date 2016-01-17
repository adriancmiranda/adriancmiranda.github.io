/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var Point = scope.uri('Point');

	// Rectangle
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var Rectangle = new Proto(function Rectangle(x, y, width, height){
		this.setTo(x, y, width, height);
	});

	Rectangle.define('x', {
		set:function(value){
			if(value === this._x){return;}
			this._x = Type.toFloat(value);
			this._left = this._x;
			this._right = this._x + this._width;
			this._topLeft = new Point(this._left, this._top);
			this._bottomRight = new Point(this._right, this._bottom);
			this._topRight = new Point(this._bottomRight.x, this._topLeft.y);
			this._bottomLeft = new Point(this._topLeft.x, this._bottomRight.y);
			this._centroid = Point.centroid(this._topLeft, this._bottomRight);
			this.onChange && this.onChange(this, 'x', this._x);
		},
		get:function(){
			return this._x;
		}
	});

	Rectangle.define('y', {
		set:function(value){
			if(value === this._y){return;}
			this._y = Type.toFloat(value);
			this._top = this._y;
			this._bottom = this._y + this._height;
			this._topLeft = new Point(this._left, this._top);
			this._bottomRight = new Point(this._right, this._bottom);
			this._topRight = new Point(this._bottomRight.x, this._topLeft.y);
			this._bottomLeft = new Point(this._topLeft.x, this._bottomRight.y);
			this._centroid = Point.centroid(this._topLeft, this._bottomRight);
			this.onChange && this.onChange(this, 'y', this._y);
		},
		get:function(){
			return this._y;
		}
	});

	Rectangle.define('width', {
		set:function(value){
			if(value === this._width){return;}
			this._width = Type.toFloat(value);
			this._right = this._x + this._width;
			this._bottomRight = new Point(this._right, this._bottom);
			this._area = this._width * this._height;
			this._centroid = Point.centroid(this._topLeft, this._bottomRight);
			this.onChange && this.onChange(this, 'width', this._width);
		},
		get:function(){
			return this._width;
		}
	});

	Rectangle.define('height', {
		set:function(value){
			if(value === this._height){return;}
			this._height = Type.toFloat(value);
			this._bottom = this._y + this._height;
			this._bottomRight = new Point(this._right, this._bottom);
			this._area = this._width * this._height;
			this._centroid = Point.centroid(this._topLeft, this._bottomRight);
			this.onChange && this.onChange(this, 'height', this._height);
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

	Rectangle.define('topRight', {
		get:function(){
			return this._topRight;
		}
	});

	Rectangle.define('bottomLeft', {
		get:function(){
			return this._bottomLeft;
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

	Rectangle.static('fromObject', function(value, x, y, width, height){
		x = value[x] || value[0] || value.x || value.left;
		y = value[y] || value[1] || value.y || value.top;
		width = value[width] || value[2] || obj.width;
		height = value[height] || value[3] || obj.height;
		return new Rectangle(x, y, width, height);
	});

	Rectangle.public('size', function(dw, dh){
		this.width = dw > 0? dw:0;
		this.height = dh > 0? dh:0;
		return this;
	});

	Rectangle.public('offset', function(dx, dy){
		this.x = dx;
		this.y = dy;
		return this;
	});

	Rectangle.public('setTo', function(x, y, width, height){
		return this.offset(x, y).size(width, height);
	});

	Rectangle.public('union', function(rectangle){
		var x1 = Math.min(this.topLeft.x, rectangle.topLeft.x);
		var y1 = Math.min(this.topLeft.y, rectangle.topLeft.y);
		var x2 = Math.max(this.bottomRight.x, rectangle.bottomRight.x);
		var y2 = Math.max(this.bottomRight.y, rectangle.bottomRight.y);
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	});

	Rectangle.public('inflate', function(dx, dy){
		return this.offset(this.x - dx, this.y - dy).size(this.width + 2 * dx, this.height + 2 * dy);
	});

	Rectangle.public('inflatePoint', function(point){
		return this.inflate(point.x, point.y);
	});

	Rectangle.public('setEmpty', function(){
		return this.setTo(0, 0, 0, 0);
	});

	Rectangle.public('isEmpty', function(){
		return this.width <= 0 || this.height <= 0;
	});

	Rectangle.public('offsetPoint', function(point){
		return this.offset(point.x, point.y);
	});

	Rectangle.public('intersects', function(rectangle){
		return this.left < rectangle.right && this.right > rectangle.left && this.top < rectangle.bottom && this.bottom > rectangle.top;
	});

	Rectangle.public('intersection', function(rectangle){
		var x1 = Math.max(this.topLeft.x, rectangle.topLeft.x);
		var y1 = Math.max(this.topLeft.y, rectangle.topLeft.y);
		var x2 = Math.min(this.bottomRight.x, rectangle.bottomRight.x);
		var y2 = Math.min(this.bottomRight.y, rectangle.bottomRight.y);
		if(x2 >= x1 && y2 >= y1){
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		}
		return new Rectangle();
	});

	Rectangle.public('intersectionArea', function(rectangle){
		return this.area / rectangle.area;
	});

	Rectangle.public('contains', function(x, y){
		return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
	});

	Rectangle.public('containsPoint', function(point){
		return this.contains(point.x, point.y);
	});

	Rectangle.public('containsRect', function(rectangle){
		return rectangle.left >= this.left && rectangle.right <= this.right && rectangle.top >= this.top && rectangle.bottom <= this.bottom;
	});

	Rectangle.public('equals', function(rectangle){
		return this.topLeft.equals(rectangle.topLeft) && this.bottomRight.equals(rectangle.bottomRight);
	});

	Rectangle.public('copyFrom', function(rectangle){
		return this.setTo(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	});

	Rectangle.public('clone', function(){
		return new Rectangle(this.x, this.y, this.width, this.height);
	});

	Rectangle.public('toString', function(){
		return '(x='+ this.x +', y='+ this.y +', width='+ this.width +', height='+ this.height +')';
	});

	scope.uri('Rectangle', Rectangle);

}).call(this, Ambox);