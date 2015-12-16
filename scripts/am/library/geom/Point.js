define([
	'../utils/Type',
	'../utils/Class'
], function(Type, Class){
	'use strict';

	var Point = new Class(function Point(x, y){
		this.setTo(x, y);
	})
	
	.define('x', {
		set:function(value){
			this._x = Type.toFloat(value);
			this._length = Math.sqrt(this._x * this._x + this._y * this._y);
		},
		get:function(){
			return this._x;
		}
	})

	.define('y', {
		set:function(value){
			this._y = Type.toFloat(value);
			this._length = Math.sqrt(this._x * this._x + this._y * this._y);
		},
		get:function(){
			return this._y;
		}
	})

	.define('length', {
		get:function(){
			return this._length;
		}
	})

	.static('polar', function(length, angle){
		return new Point(length * Math.cos(angle), length * Math.sin(angle));
	})

	.static('distance', function(pointA, pointB){
		return pointA.distanceTo(pointB);
	})

	.static('interpolate', function(pointA, pointB, f){
		return pointA.interpolate(pointB, f);
	})

	.method('interpolate', function(point, f){
		return new Point(point.x + (this.x - point.x) * f, point.y + (this.y - point.y) * f);
	})

	.method('setTo', function(x, y){
		this.x = x;
		this.y = Type.isDefined(y)? Type.toFloat(y):this.x;
		return this;
	})

	.method('normalize', function(thickness){
		var magnitude = this.length();
		thickness = Type.isNumeric(thickness) ? Type.toFloat(thickness) : 1;
		this.x = this.x / magnitude * thickness;
		this.y = this.y / magnitude * thickness;
		return this;
	})

	.method('add', function(point){
		return new Point(this.x + point.x, this.y + point.y);
	})

	.method('subtract', function(point){
		return new Point(this.x - point.x, this.y - point.y);
	})

	.method('offset', function(dx, dy){
		return this.setTo(this.x + dx, this.x + dy);
	})

	.method('horizontalDistanceTo', function(point){
		return Math.abs(this.x - point.x);
	})

	.method('verticalDistanceTo', function(point){
		return Math.abs(this.y - point.y);
	})

	.method('distanceTo', function(point){
		return Math.sqrt(Math.pow(this.horizontalDistanceTo(point, 2)) + Math.pow(this.verticalDistanceTo(point, 2)));
	})

	.method('manhattan', function(point){
		return this.horizontalDistanceTo(point) + this.verticalDistanceTo(point);
	})

	.method('equals', function(point){
		return(point.x === this.x && point.y === this.y);
	})

	.method('copyFrom', function(point){
		return this.setTo(point.x, point.y);
	})

	.method('clone', function(){
		return new Point(this.x, this.y);
	})

	.method('toRadians', function(dx, dy){
		dx = this.x - dx;
		dy = this.y - dy;
		return Math.atan2(dx, dy);
	})

	.method('toDegrees', function(dx, dy){
		var angle = this.toRadians(dx, dy);
		return angle * (180 / Math.PI);
	})

	.method('toString', function(){
		return '(x='+ this.x +', y='+ this.y +')';
	});
	
	return Point;
});