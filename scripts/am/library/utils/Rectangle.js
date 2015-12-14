define([
	'./Type',
	'./Class'
], function(Type, Class){
	'use strict';

	var Rectangle = new Class(function Rectangle(x, y, width, height){
		this.setTo(x, y, width, height);
	});

	Rectangle.method('setTo', function(x, y, width, height){
		this.x = Type.toFloat(x);
		this.y = Type.toFloat(y);
		this.width = Type.toFloat(width);
		this.height = Type.toFloat(height);
	});

	Rectangle.method('contains', function(x, y){
		x = Type.toFloat(x);
		y = Type.toFloat(y);
		if(this.width <= 0 || this.height <= 0){
			return false;
		}
		if(x >= this.x && x < this.x + this.width){
			if(y >= this.y && y < this.y + this.height){
				return true;
			}
		}
		return false;
	});

	Rectangle.method('equals', function(r){
		return(r.x === this.x && r.y === this.y && r.width === this.width && r.height === this.height);
	});

	Rectangle.method('copy', function(r){
		this.setTo(r.x, r.y, r.width, r.height);
	});

	Rectangle.method('clone', function(){
		return new Rectangle(this.x, this.y, this.width, this.height);
	});

	return Rectangle;
});
