/* global Ambox */
(function(Ambox){
	var Type = Ambox.namespace('Type');
	var Proto = Ambox.namespace('Proto');

	// Promise/A+
	// @role Normalize Promise/A+
	// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
	// @see http://caniuse.com/#search=Promise
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var Promise = Proto(function Promise(cmd, ctx){
		Proto.rebind(this, 'resolve', 'reject');
		this.do.apply(this,[cmd,ctx,this].concat(Type.toArray(arguments, 2)));
	});

	Promise.static('isThenable', function(value){
		return (Type.isObjectLike(value) || Type.isFunction(value)) && Type.isFunction(value.then);
	});

	Promise.static('resolve', function(value){
		return new Promise(function(resolve){
			resolve(value);
		});
	});

	Promise.static('reject', function(value){
		return new Promise(function(resolve, reject){
			reject(value);
		});
	});

	Promise.static('race', function(promises){
		promises = Type.toArray(Type.isArray(arguments[0])? arguments[0]:arguments);
		return new Promise(function(resolve, reject){
			for(var id = 0; id < promises.length; id++){
				promises[id].then(resolve, reject);
			}
		});
	});

	Promise.static('all', function(promises){
		promises = Type.toArray(Type.isArray(arguments[0])? arguments[0]:arguments);
		return new Promise(function(resolve, reject){
			var remaining = promises.length;
			function exec(value, id){
				try{
					if(Promise.isThenable(value)){
						value.then.call(value, function(value){
							exec(value, id);
						}, reject);
						return void(0);
					}
					promises[id] = value;
					if(!--remaining){
						resolve(promises);
					}
				}catch(error){
					reject(error);
				}
			}
			for(var id = 0; id < promises.length; id++){
				exec(promises[id], id);
			}
		});
	});

	Promise.public('do', function(cmd, ctx){
		var hasExecutor = Type.isFunction(cmd);
		this.deferreds = [];
		if(Type.isDefined(cmd) && !hasExecutor){
			throw new TypeError('Executor isn\'t a function.');
		}else if(Type.isDefined(this.isDone)){
			throw new TypeError('`Promise.prototype.do` has been called.');
		}else if(hasExecutor){
			this.isDone = true;
			this.command = cmd;
			this.context = ctx = ctx || this;
			this.params = Type.toArray(arguments, 2);
			delete this.isFulfilled;
			try{cmd.apply(ctx,[this.resolve,this.reject].concat(this.params));}
			catch(error){this.reject(error);}
		}
	});

	Promise.public('resolve', function(value){
		if(Type.isUndefined(this.isFulfilled)){
			try{
				if(value === this){
					throw new TypeError('A promise cannot be resolved with itself.');
				}else if(Promise.isThenable(value)){
					delete this.isDone;
					if(value instanceof this.constructor){
						this.do(value.then, value.context);
						return void(0);
					}
					this.do(value.then, value);
					return void(0);
				}
				this.fulfill(true, value);
			}catch(error){
				this.reject(error);
			}
		}
	});

	Promise.public('reject', function(reason){
		if(Type.isUndefined(this.isFulfilled)){
			this.fulfill(false, reason);
		}
	});

	Promise.public('fulfill', function(success, result){
		if(Type.isDefined(success) && Type.isDefined(result)){
			this.isFulfilled = success;
			this.value = result;
			for(var id=0; id<this.deferreds.length; id++){
				this.dispatch(this.deferreds[id]);
			}
			this.deferreds = [];
		}
	});

	Promise.public('dispatch', function(deferred){
		if(Type.isUndefined(this.isFulfilled)){
			this.deferreds.push(deferred);
		}else{
			var result;
			var callback = this.isFulfilled? deferred.onFulfilled:deferred.onRejected;
			if(Type.isNull(callback)){
				callback = this.isFulfilled? deferred.resolve:deferred.reject;
				callback(this.value);
				return void(0);
			}
			try{
				result = callback(this.value);
			}catch(error){
				deferred.reject(error);
				return void(0);
			}
			deferred.resolve(result);
		}
	});

	Promise.public('then', function(onFulfilled, onRejected){
		return new Promise(function(resolve, reject){
			this.dispatch(new (function Deferred(){
				this.onFulfilled =  Type.isFunction(onFulfilled)? onFulfilled:null;
				this.onRejected = Type.isFunction(onRejected)? onRejected:null;
				this.resolve = resolve;
				this.reject = reject;
			}));
		}, this);
	});

	Promise.public('catch', function(onRejected){
		return this.then(null, onRejected);
	});

	Promise.public('success', function(onFulfilled, onRejected){
		return this.then(onFulfilled, onRejected);
	});

	Promise.public('error', function(onRejected){
		return this.then(null, onRejected);
	});

	Ambox.namespace('Promise', Promise);

}).call(this, Ambox);