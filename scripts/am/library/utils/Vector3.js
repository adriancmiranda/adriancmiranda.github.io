define([
	'./Type',
	'./Class'
], function(Type, Class){
	'use strict';

	var Vector3 = new Class(function Vector3(x, y, z){
		this.setTo(x, y, z);
	});

	Vector3.method('setTo', function(x, y, z){
		this.x = Type.toFloat(x);
		this.y = Type.toFloat(y);
		this.z = Type.toFloat(y);
	});

	Vector3.method('equals', function(v){
		return(v.x === this.x && v.y === this.y && v.z === this.z);
	});

	Vector3.method('copy', function(v){
		this.setTo(v.x, v.y, v.z);
	});

	Vector3.method('clone', function(){
		return new Vector3(this.x, this.y, this.z);
	});

	return Vector3;
});