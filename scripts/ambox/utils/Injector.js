/* global Ambox */
(function(scope){
	var each = scope.uri('each');
	var Proto = scope.uri('Proto');

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
		return iterate.index(params, function(name){
			return this._dependencies[name];
		}, this);
	});

	Injector.static('register', function(name, dependency){
		this._dependencies = this._dependencies || Proto.create(null);
		this._dependencies[name] = dependency;
		return dependency;
	});

	scope.uri('Injector', Injector);

}).call(this, Ambox);