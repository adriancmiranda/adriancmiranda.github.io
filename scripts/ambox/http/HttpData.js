/* global Ambox */
(function(Ambox){
	var Proto = Ambox.namespace('Proto');

	// HttpData
	// @support IE10+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest
	var HttpData = new Proto(function HttpData(){
	});

	Ambox.namespace('HttpData', HttpData);

}).call(this, Ambox);