/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var patterns = scope.uri('patterns');

	// HttpTransform (defaults)
	// @support everywhere
	scope.uri('HttpTransform', {
		request:function(data){
			return Type.test('File|Blob|FormData', data, true)? data : Type.toJson(data);
		},
		response:function(data, headers){
			if(Type.isString(data)){
				var tempData = data.replace(patterns.jsonProtectionPrefix, '').trim();
				if(tempData){
					var contentType = headers('Content-Type');
					if((contentType && (contentType.indexOf('application/json') === 0)) || Type.isJsonLike(tempData)){
						data = Type.fromJson(tempData);
					}
				}
			}
			return data;
		}
	});

}).call(this, Ambox);