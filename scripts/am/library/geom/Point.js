define([
	'../utils/Type',
	'../utils/Class'
], function(Type, Class){
	'use strict';

	var Point = new Class(function Point(x, y){
		this.setTo(x, y);
	});

	Point.static('polar', function(length, angle){
		length = Type.toFloat(length);
		angle = Type.toFloat(angle);
		return new Point(length * Math.cos(angle), length * Math.sin(angle));
	});

	Point.static('distance', function(pointA, pointB){
		return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
	});

	Point.static('interpolate', function(pointA, pointB, f){
		return pointA.interpolate(pointB, f);
	});

	Point.method('setTo', function(x, y){
		this.x = Type.toFloat(x);
		this.y = Type.isDefined(y)? Type.toFloat(y):this.x;
	});

	Point.method('length', function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	});

	Point.method('add', function(point){
		return new Point(this.x + point.x, this.y + point.y);
	});

	Point.method('subtract', function(point){
		return new Point(this.x - point.x, this.y - point.y);
	});

	Point.method('offset', function(dx, dy){
		dx = Type.toFloat(dx);
		dy = Type.toFloat(dy);
		this.setTo(this.x + dx, this.x + dy);
	});

	Point.method('manhattan', function(point){
		return Math.abs(this.x - point.x) + Math.abs(this.y - point.y);
	});

	Point.method('normalize', function(thickness){
		var magnitude = this.length();
		thickness = Type.isNumeric(thickness) ? Type.toFloat(thickness) : 1;
		this.x = this.x / magnitude * thickness;
		this.y = this.y / magnitude * thickness;
	});

	Point.method('equals', function(toCompare){
		return(toCompare.x === this.x && toCompare.y === this.y);
	});

	Point.method('copyFrom', function(sourcePoint){
		this.setTo(sourcePoint.x, sourcePoint.y);
	});

	Point.method('clone', function(){
		return new Point(this.x, this.y);
	});

	Point.method('toRadians', function(dx, dy){
		dx = this.x - Type.toFloat(dx);
		dy = this.y - Type.toFloat(dy);
		return Math.atan2(dx, dy);
	});

	Point.method('toDegrees', function(dx, dy){
		var angle = this.toRadians(dx, dy);
		return angle * (180 / Math.PI);
	});

	Point.method('toString', function(){
		return '(x='+ this.x +', y='+ this.y +')';
	});
	
	return Point;
});