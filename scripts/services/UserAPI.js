/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');

	var UserAPI = new Proto(function(){
		// N/A yet.
	});

	scope.uri('UserAPI', UserAPI);

}).call(this, Ambox);