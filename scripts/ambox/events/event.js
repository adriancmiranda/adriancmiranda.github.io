/* global Ambox */
(function(Ambox){
	var Proto = Ambox.namespace('Proto');

	// event normalize
	// @support IE8 fallback - Thank`s Dean Edwards
	// @see http://caniuse.com/#search=addEventListener
	// @see http://dean.edwards.name/my/events.js
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

	Ambox.namespace('event', event);

}).call(this, Ambox);
