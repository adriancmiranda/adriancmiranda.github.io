/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');

	// Interface (Ecma5)
	// @role An extensible program-code-template for creating objects
	// @support IE9+, FF4-20+, SF5.1.4+, CH5+, OP11.60-OP12+, iOS7/8, Android4.4+
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	function Interface(name, methods){
		this.name = name;
		this.methods = [];
		for(var id = 0, total = methods.length, method; id < total; id++){
			method = methods[id];
			if(!Type.isString(method)){
				throw new Error('Interface constructor expects method names to be passed in as a string.');
			}
			this.methods.push(method);
		}
	}

	Interface.ensureImplements = function(object){
		var interfaces = Type.toArray(arguments, 1);
		for(var ia = 0, la = interfaces.length, interface; ia < la; ia++){
			interface = interfaces[ia];
			if(interface.constructor !== Interface){
				throw new Error('Object trying to implement a non-interface. '+ interface.name +' is not an Interface.');
			}
			for(var ib = 0, lb = interface.methods.length, method; ib < lb; ib++){
				method = interface.methods[ib];
				if(!object[method] || !Type.isFunction(object[method])){
					throw new Error('Interface method not implemented. '+ interface.name +' defines method '+ method);
				}
			}
		}
		return true;
	};

	scope.uri('Interface', Interface);

}).call(this, Ambox);