define([
	'./Type',
	'./Class',
	'./Vendor',
	'../events/EventEmitter'
], function(Type, Class, Vendor, EventEmitter){

	var Ticker = new Class(function Ticker(FPS){
		var hasPerformance, navigationStart;

		// Singleton Ticker is maybe the best practice for now.
		if(Ticker.prototype.instance){
			return Ticker.prototype.instance;
		}else if(this instanceof Ticker){
			hasPerformance = !!(window.performance && window.performance.now);
			navigationStart = hasPerformance && window.performance.timing.navigationStart;
			this.FPMS = Type.isNumeric(FPS) ? Type.toFloat(FPS) / 1000 : 0.06;
			this.constructor.instance = this;
			this.constructor.GROUP = 'Ticker';
			this.constructor.TICK = 'tick';
			this.emitter = new EventEmitter();
			this.lastTime = +new Date();
			this.lastRequestTime = 0;
			this.maxElapsedMS = 100;
			this.elapsedMS = 1 / this.FPMS;
			this.deltaTime = 1;
			this.speed = 1;
			this.startTime = navigationStart || +new Date();
			this.performance = hasPerformance ? window.performance : {};
			this.performance.now = this.performance.now || this._now;
			delete(Ticker.prototype._now);

			// requestAnimationFrame polyfill
			window.requestAnimationFrame = Vendor(window, 'requestAnimationFrame') || this._request;
			delete(Ticker.prototype._request);

			// cancelAnimationFrame polyfill
			window.cancelAnimationFrame = Vendor(window, ['cancelAnimationFrame', 'cancelRequestAnimationFrame']) || this._cancel;
			delete(Ticker.prototype._cancel);

			Ticker.prototype.instance = this;
			return Ticker.prototype.instance;
		}
		return new Ticker(FPS);
	});

	Ticker.method('add', function(listener, context){
		this.emitter.on(Ticker.TICK, Ticker.GROUP, listener, context);
		!this.frame && this.start();
		return this;
	});

	Ticker.method('addOnce', function(listener, context){
		this.emitter.once(Ticker.TICK, Ticker.GROUP, listener, context);
		!this.frame && this.start();
		return this;
	});

	Ticker.method('remove', function(listener){
		this.emitter.off(Ticker.TICK, listener);
		if(!this.emitter.listeners[Ticker.TICK]){
			this.stop();
		}
		return this;
	});

	Ticker.method('start', function(){
		var scope = this;
		if(this.frame || !this.emitter.listeners[Ticker.TICK]){
			return void(0);
		}
		this.lastRequestTime = this.performance.now();
		(function tick(now){
			var elapsedMS = scope.elapsedMS = now - scope.lastRequestTime;
			if(elapsedMS > scope.maxElapsedMS){
				elapsedMS = scope.maxElapsedMS;
			}
			scope.deltaTime = elapsedMS * scope.FPMS * scope.speed;
			scope.emitter.trigger(Ticker.TICK, scope.deltaTime);
			scope.lastRequestTime = now;
			scope.frame = window.requestAnimationFrame(tick);
		}(this.performance.now()));
	});

	Ticker.method('stop', function(){
		window.cancelAnimationFrame(this.frame);
		delete(this.frame);
	});

	Ticker.method('setMinFPS', function(FPS){
		var minFPMS = Math.min(Math.max(0, FPS) / 1000, this.FPMS);
		this.maxElapsedMS = 1 / minFPMS;
	});

	Ticker.method('getMinFPS', function(){
		return 1000 / this.maxElapsedMS;
	});

	Ticker.method('getFPS', function(){
		return 1000 / this.elapsedMS;
	});

	Ticker.method('dispose', function(){
		this.emitter.releaseGroup(Ticker.GROUP);
		this.stop();
	});

	// This method is deleted when `Ticker` is instantiated.
	Ticker.method('_request', function(callback){
		var currentTime, delay, scope = this;
		currentTime = +new Date();
		delay = 16 + scope.lastTime - currentTime;
		delay = delay < 0 ? 0 : delay;
		scope.lastTime = currentTime;
		return window.setTimeout(function(){
			scope.lastTime = +new Date();
			callback(scope.now());
		}, delay);
	});

	// This method is deleted when `Ticker` is instantiated.
	Ticker.method('_cancel', function(frame){
		window.clearTimeout(frame);
	});

	// This method is deleted when `Ticker` is instantiated.
	Ticker.method('_now', function(){
		return +new Date() - this.startTime;
	});

	return Ticker;
});
