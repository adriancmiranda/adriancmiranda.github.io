/* global Ambox */
(function(Ambox){
	var Proto = Ambox.namespace('Proto');

	// event
	// @role IE8 `event` normalized - Thank`s Dean Edwards
	// @see http://caniuse.com/#search=addEventListener
	// @see http://dean.edwards.name/my/events.js
	// @support everywhere
	// @author Dean Edwards
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

	Ambox.namespace('event', event);

}).call(this, Ambox);
