/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');

	// Vendor
	// @role Normalize browser prefixed properties
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var Vendor = new Proto(function Vendor(context, prop){
		var method = Type.isArray(prop)? 'filter' : 'prefixed';
		return context[Vendor[method](context, prop)];
	});

	Vendor.static('prefixes', [
		'', 'Webkit', 'webkit', 'Moz', 'moz', 'MS', 'ms',
		'O', 'o', 'Khtml', 'khtml', 'Icab', 'icab'
	]);

	Vendor.static('filter', function(context, properties){
		for(var id = 0, prefixed; id < properties.length; id++){
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
	
	

	Vendor.static('transitionEnd', function(){
		var transitions = {
			WebkitTransition:'webkitTransitionEnd',
			MozTransition:'transitionend',
			OTransition:'oTransitionEnd otransitionend',
			transition:'transitionend'
		};
		return transitions[Vendor.prefixed(transitions, 'transition')]
	}());

	Vendor.static('animationEnd', function(){
		var animations = {
			WebkitAnimation: 'webkitAnimationEnd',
			OAnimation: 'oAnimationEnd',
			msAnimation: 'MSAnimationEnd',
			animation: 'animationend'
		};
		return animations[Vendor.prefixed(animations, 'animation')]
	}());

	scope.uri('Vendor', Vendor);

}).call(this, Ambox);
