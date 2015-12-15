define([
	'scope',
	'portifa/services/ParseAPI'
], function(scope, ParseAPI){
	'use strict';
	
	var UserAPI = new Class(function UserAPI(){
		this.super.constructor.call(this);
	}).extends(ParseAPI);


	// Users
	// =====

	UserAPI.method('currentUser', function(){
		return ParseAPI.current();
	});

	UserAPI.method('signUp', function(userVO){
		return ParseAPI.signUp(userVO);
	});

	UserAPI.method('logIn', function(userVO){
		return ParseAPI.logIn(userVO.username, userVO.password);
	});

	UserAPI.method('logOut', function(){
		return ParseAPI.logOut();
	});

	UserAPI.method('requestPasswordReset', function(userVO){
		return ParseAPI.requestPasswordReset(userVO.username);
	});

	UserAPI.method('isAuthorized', function(authorizedRoles){
		return true;
	});

	UserAPI.method('role', function(authorizedRoles){
		return null;
	});


	// Accounts
	// ========

	UserAPI.method('set', function(VO){
		return null;
	});

	UserAPI.method('get', function(VO){
		return null;
	});

	UserAPI.method('edit', function(VO){
		return null;
	});

	UserAPI.method('delete', function(VO){
		return null;
	});

	UserAPI.method('getList', function(VO){
		return null;
	});

	UserAPI.method('deleteList', function(VO){
		return null;
	});

	UserAPI.method('updateList', function(VO){
		return null;
	});

	return UserAPI;
});