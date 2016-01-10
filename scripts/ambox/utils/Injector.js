/* global Ambox */
(function(Ambox){
	var Proto = Ambox.namespace('Proto');

	var Injector = new Proto(function Injector(target){
		Injector.process(target);
	});

	Injector.static('process', function(target){
		var ctrlIndex = target.length - 1;
		var ctrl = target[ctrlIndex];
		var args = target.slice(0, ctrlIndex);
		return ctrl.apply(ctrl, this.getDependencies(args));
	});

	Injector.static('getDependencies', function(params){
		// return Map.array(params, function(name){
		// 	return this._dependencies[name];
		// }, this);
	});

	Injector.static('register', function(name, dependency){
		this._dependencies = this._dependencies || Proto.create(null);
		this._dependencies[name] = dependency;
		return dependency;
	});

	Ambox.namespace('Injector', Injector);

}).call(this, Ambox);