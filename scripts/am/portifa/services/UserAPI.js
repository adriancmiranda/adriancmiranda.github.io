define([
	'scope',
	'./ParseAPI'
], function(scope, ParseAPI){
	'use strict';
	
	var UserAPI = new Class(function UserAPI(){
		this.super.constructor.call(this);
	}).extends(ParseAPI);

	return UserAPI;
});
