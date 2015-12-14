define([
	'scope',
	'./RequestAPI'
], function(scope, RequestAPI){
	'use strict';
	
	var ParseAPI = new Class(function ParseAPI(){
		this.super.constructor.call(this);
	}).extends(RequestAPI);

	return ParseAPI;
});
