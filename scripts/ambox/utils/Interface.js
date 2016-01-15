/* global Ambox */
(function(scope){

	// Interface (Ecma5)
	// @role An extensible program-code-template for creating objects
	// @support IE9+, FF4-20+, SF5.1.4+, CH5+, OP11.60-OP12+, iOS7/8, Android4.4+
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	function Interface(name, methods){
		this.name = name;
		this.methods = [];
		if(methods.constructor === Array){
			this.methods = methods;
		}else if(methods.constructor === String){
			this.methods[0] = methods;
		}else{
			throw new Error('Interface must define methods as a String or an Array of Strings');
		}
	}

	Interface.ensureImplements = function(object, interfaces){
		var toImplement = interfaces.constructor === Array? interfaces : [interfaces];
		for(var ia = 0, la = toImplement.length, interface; ia < la; ia++){
			interface = toImplement[ia];
			if(interface.constructor !== Interface){
				throw new Error('Object trying to implement a non-interface. '+ interface.name +' is not an Interface.');
			}
			for(var ib = 0, lb = interface.methods.length; ib < lb; ib++){
				if(!object[interface.methods[ib]]){
					throw new Error('Interface method not implemented. '+ interface.name +' defines method '+ interface.methods[ib]);
				}
			}
		}
		return true;
	};

	scope.uri('Interface', Interface);

}).call(this, Ambox);