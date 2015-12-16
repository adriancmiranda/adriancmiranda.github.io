define([
	'../utils/Type',
	'../utils/Class'
], function(Type, Class){
	'use strict';

	var Vector3 = new Class(function Vector3(x, y, z){
		this.setTo(x, y, z);
	});

	Vector3.define('x', {
		set:function(value){
			this._x = Type.toFloat(value);
			this._length = Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
		},
		get:function(){
			return this._x;
		}
	});

	Vector3.define('y', {
		set:function(value){
			this._y = Type.toFloat(value);
			this._length = Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
		},
		get:function(){
			return this._y;
		}
	});

	Vector3.define('z', {
		set:function(value){
			this._z = Type.toFloat(value);
			this._length = Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
		},
		get:function(){
			return this._z;
		}
	});

	Vector3.define('length', {
		get:function(){
			return this._length;
		}
	});

	Vector3.method('setTo', function(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	});

	Vector3.method('add', function(vector3){
		return new Vector3(this.x + vector3.x, this.y + vector3.y, this.z + vector3.z);
	});

	Vector3.method('subtract', function(vector3){
		return new Vector3(this.x - vector3.x, this.y - vector3.y, this.z - vector3.z);
	});

	Vector3.method('addScalar', function(scalar){
		return this.setTo(this.x + scalar, this.y + scalar, this.z + scalar);
	});

	Vector3.method('subtractScalar', function(scalar){
		return this.setTo(this.x - scalar, this.y - scalar, this.z - scalar);
	});

	Vector3.method('normalize', function(thickness){
		thickness = Type.isNumeric(thickness)? Type.toFloat(thickness):1;
		this.x = this.x / this.length * thickness;
		this.y = this.y / this.length * thickness;
		this.z = this.z / this.length * thickness;
		return this;
	});

	Vector3.method('equals', function(vector3){
		return(this.x === vector3.x && this.y === vector3.y && this.z === vector3.z);
	});

	Vector3.method('copyFrom', function(vector3){
		this.setTo(vector3.x, vector3.y, vector3.z);
	});

	Vector3.method('clone', function(){
		return new Vector3(this.x, this.y, this.z);
	});

	Vector3.method('toString', function(){
		return '(x='+ this.x +', y='+ this.y +', z='+ this.z +')';
	});

	return Vector3;
});