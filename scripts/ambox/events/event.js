/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');

	// event
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var event = new Proto(function event(evt){
		evt.preventDefault = event.preventDefault;
		evt.stopPropagation = event.stopPropagation;
		return evt;
	});

	event.public('preventDefault', function(){
		this.returnValue = false;
	});

	event.public('stopPropagation', function(){
		this.cancelBubble = true;
	});

	scope.uri('event', event);

}).call(this, Ambox);