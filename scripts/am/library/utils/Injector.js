define([
	'./Map',
	'./Class'
], function(Map, Class){

	var Injector = new Class(function Injector(target){
		Injector.process(target);
	});

	Injector.static('process', function(target){
		var ctrlIndex = target.length - 1;
		var ctrl = target[ctrlIndex];
		var args = target.slice(0, ctrlIndex);
		return ctrl.apply(ctrl, this.getDependencies(args));
	});

	Injector.static('getDependencies', function(params){
		return Map.array(params, function(name){
			return this._dependencies[name];
		}, this);
	});

	Injector.static('register', function(name, dependency){
		this._dependencies = this._dependencies||{};
		this._dependencies[name] = dependency;
		return dependency;
	});

	return Injector;
});
