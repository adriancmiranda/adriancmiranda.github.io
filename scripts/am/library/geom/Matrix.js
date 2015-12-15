define([
	'../utils/Type',
	'../utils/Class'
], function(Type, Class){
	'use strict';

	var Matrix = new Class(function Matrix(a, b, c, d, tx, ty){
		this.setTo(a, b, c, d, tx, ty);
	});

	Matrix.method('setTo', function(a, b, c, d, tx, ty){
		this.a = Type.isNumber(a)? a:1;
		this.b = Type.isNumber(b)? b:0;
		this.c = Type.isNumber(c)? c:0;
		this.d = Type.isNumber(d)? d:1;
		this.tx = Type.isNumber(tx)? tx:0;
		this.ty = Type.isNumber(ty)? ty:0;
	});

	Matrix.method('translate', function(tx, ty){
		// TODO
	});

	Matrix.method('rotate', function(angle){
		// TODO
	});

	Matrix.method('scale', function(sx, sy){
		// TODO
	});

	Matrix.method('fromArray', function(list){
		this.setTo(list[0], list[1], list[2], list[3], list[4], list[5]);
	});

	Matrix.method('equals', function(m){
		return(m.a === this.a && m.b === this.b && m.c === this.c && m.d === this.d && m.tx === this.tx && m.ty === this.ty);
	});

	Matrix.method('copy', function(m){
		this.setTo(m.a, m.b, m.c, m.d, m.tx, m.ty);
	});

	Matrix.method('clone', function(){
		return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
	});

	return Matrix;
});
