define([
	'scope',
	'portifa/facade'
], function(scope, Facade){

	var main = new Facade(document.getElementById('view'));

	main.startRender();
	
	return main;
});