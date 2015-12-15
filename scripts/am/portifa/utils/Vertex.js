define([
	'./Type',
	'library/utils/Class'
], function(Type, Class){
	'use strict';

	var Point = new Class(function Point(x, y){
		this.setTo(x, y);
	});
	
	Point.static('fromAngle', function(angle, magnitude){
		return new Point(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
	});

	Point.method('setTo', function(x, y){
		this.x = Type.toFloat(x);
		this.y = Type.isDefined(y) ? Type.toFloat(y) : this.x;
	});

	Point.method('add', function(p){
		this.x += p.x;
		this.y += p.y;
	});

	Point.method('getMagnitude', function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	});

	Point.method('getAngle', function(p){
		return Math.atan2(this.y, this.x);
	});

	Point.method('equals', function(p){
		return(p.x === this.x && p.y === this.y);
	});

	Point.method('copy', function(p){
		this.setTo(p.x, p.y);
	});

	Point.method('clone', function(){
		return new Point(this.x, this.y);
	});
	
	return Point;
});