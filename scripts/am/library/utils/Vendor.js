define([
	'./Type',
	'./Class'
], function(Type, Class){

	var Vendor = new Class(function Vendor(context, prop){
		var method = Type.isArray(prop)? 'filter':'prefixed';
		return context[Vendor[method](context, prop)];
	});

	Vendor.static('prefixes', [
		'', 'Webkit', 'webkit', 'Moz', 'moz', 'MS', 'ms',
		'O', 'o', 'Khtml', 'khtml', 'Icab', 'icab'
	]);

	Vendor.static('filter', function(context, properties){
		for(var id=0, prefixed; id<properties.length; id++){
			prefixed = this.prefixed(context, properties[id]);
			if(prefixed){
				return prefixed;
			}
		}
	});

	Vendor.static('prefixed', function(context, property){
		if(!property){return property;}
		var prefix, prop, id = -1;
		var camelProp = property[0].toUpperCase() + property.slice(1);
		while(++id < this.prefixes.length){
			prefix = this.prefixes[id];
			prop = prefix? prefix + camelProp:property;
			if(prop in context){
				return prop;
			}
		}
	});

	return Vendor;
});
