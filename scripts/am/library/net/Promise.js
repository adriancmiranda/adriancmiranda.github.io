define(function(){
	
	var Promise = new Class(function Promise(){
		this.callbacks = [];
	});

	Promise.static('chain', function(fns, args){
		var instance = new Promise();
		if(fns.length === 0){
			instance.done.apply(instance, args);
		}else{
			fns[0].apply(null, args).then(function(){
				fns.splice(0, 1);
				chain(fns, arguments).then(function(){
					instance.done.apply(instance, arguments);
				});
			});
		}
		return instance;
	});

	Promise.static('join', function(promises){
		var instance = new Promise();
		var results = [];
		if(!promises || !promises.length){
			instance.done(results);
			return instance;
		}
		var numdone = 0;
		var total = promises.length;
		function notifier(id){
			return function(){
				numdone += 1;
				results[id] = Array.prototype.slice.call(arguments);
				if(numdone === total){
					instance.done(results);
				}
			};
		}
		for(var id = 0; id < total; id++) {
			promises[id].then(notifier(id));
		}
		return instance;
	});

	Promise.method('then', function(fn, ctx){
		var instance;
		if(this.isDone){
			instance = fn.apply(ctx, this.result);
		}else{
			instance = new Promise();
			this.callbacks.push(function(){
				var result = fn.apply(ctx, arguments);
				if(result && typeof result.then === 'function'){
					result.then(instance.done, instance);
				}
			});
		}
		return instance;
	});

	Promise.method('done', function(){
		this.result = arguments;
		this.isDone = true;
		for(var id = 0; id < this.callbacks.length; id++){
			this.callbacks[id].apply(null, arguments);
		}
		this.callbacks = [];
	});

	return Promise;
});
