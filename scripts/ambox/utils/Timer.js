/* global Ambox */
(function(Ambox){
	var Type = Ambox.namespace('Type');
	var Proto = Ambox.namespace('Proto');
	var Ticker = Ambox.namespace('Ticker');
	var EventEmitter = Ambox.namespace('EventEmitter');

	// Timer (Ecma5)
	// @role AS3 port
	// @see http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/utils/Timer.html
	var Timer = new Proto(function Timer(delay, repeatCount, continuous){
		this.super.constructor.call(this);
		Proto.rebind(this, 'onUpdate');
		this._continuous = Type.isDefined(continuous)? Type.toBoolean(continuous):true;
		this._delay = Type.isUndefined(delay)? 1000:Type.toFloat(delay);
		this._repeatCount = Type.toInt(repeatCount);
		this._currentCount = 0;
		this._running = false;
	}).extends(EventEmitter).static({
		COMPLETE:'complete',
		UPDATE:'update',
		START:'start',
		RESET:'reset',
		STOP:'stop'
	});

	Timer.define('delay', {
		set:function(value){
			this._currentCount = 0;
			this._lastTime = +new Date();
			this._delay = Type.toFloat(value);
		},
		get:function(){
			return this._delay;
		}
	});

	Timer.define('repeatCount', {
		set:function(value){
			this._repeatCount = Type.toInt(value);
		},
		get:function(){
			return this._repeatCount;
		}
	});

	Timer.define('running', {
		set:function(value){
			this._running = Type.toBoolean(value);
			this._running? this.start():this.stop();
		},
		get:function(){
			return this._running;
		}
	});

	Timer.define('currentCount', {
		get:function(){
			return this._currentCount;
		}
	});

	Timer.define('duration', {
		get:function(){
			return this._delay * this._repeatCount;
		}
	});

	Timer.define('time', {
		get:function(){
			return this._currentCount * this._delay;
		}
	});

	Timer.public('start', function(){
		this._running = true;
		this._lastTime = +new Date();
		if(this._continuous){alert('_continuous');
			this._continuous = Ticker.setRequest(this.onUpdate, this);
		}else{
			Ticker.add(this.onUpdate, this);
		}
		this.emit(Timer.START, this);
	});

	Timer.public('stop', function(){
		this._running = false;
		Ticker.remove(this.onUpdate, this);
		Ticker.clearRequest(this._continuous);
		this.emit(Timer.STOP, this);
	});

	Timer.public('reset', function(){
		this._currentCount = 0;
		this._running = false;
		this._lastTime = +new Date();
		this.emit(Timer.RESET, this);
	});

	Timer.public('onUpdate', function(deltaTime){
		if(this._running && +new Date() - this._lastTime >= this._delay){
			++this._currentCount;
			this._lastTime = +new Date();
			this.emit(Timer.UPDATE, this);
			if(this._repeatCount !== 0 && this._currentCount >= this._repeatCount){
				this.stop();
				this.emit(Timer.COMPLETE, this);
			}
		}
	});

	Ambox.namespace('Timer', Timer);

}).call(this, Ambox);