/* global Ambox */
(function(Ambox){
	var Proto = Ambox.namespace('Proto');

	// HttpHeaders
	// @support IE10+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest
	var HttpHeaders = new Proto(function HttpHeaders(){
		// @see Memento Design Pattern

		// 1:Merge: headers.options + headers.common + headers.method
		// 2:Remove Content-Type from headers if no data.

		// 3:Encapsula objeto em uma função que fará acesso aos dados.
		// 3:1:Na primeira chamada desse método os headers devem ser parseados
	}).static('defaults', {
		common:{Accept:'application/json, text/plain, */*'},
		patch:{'Content-Type':'application/json;charset=utf-8'},
		post:{'Content-Type':'application/json;charset=utf-8'},
		put:{'Content-Type':'application/json;charset=utf-8'}
	});

	Ambox.namespace('HttpHeaders', HttpHeaders);

}).call(this, Ambox);