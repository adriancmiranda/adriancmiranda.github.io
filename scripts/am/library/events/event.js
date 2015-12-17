define([
	'../utils/Class'
], function(Class){

	var event = new Class(function event(evt){
		evt.preventDefault = event.preventDefault;
		evt.stopPropagation = event.stopPropagation;
		return evt;
	});

	event.method('preventDefault', function(){
		this.returnValue = false;
	});

	event.method('stopPropagation', function(){
		this.cancelBubble = true;
	});

	return event;
});
