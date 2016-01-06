/* global Ambox */
(function(Ambox){
	var Proto = Ambox.namespace('Proto');

	var EventEmitter = new Proto(function EventEmitter(){});

	Ambox.namespace('EventEmitter', EventEmitter);

}).call(this, Ambox);