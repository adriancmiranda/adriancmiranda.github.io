/* global Ambox */
(function(Ambox){
	var Type = Ambox.namespace('Type');
	var Proto = Ambox.namespace('Proto');
	var Ticker = Ambox.namespace('Ticker');
	var EventEmitter = Ambox.namespace('EventEmitter');

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

	Timer.charge('delay', function(value){
		this._currentCount = 0;
		this._lastTime = +new Date();
		this._delay = Type.toFloat(value);
		return this;
	});

	Timer.charge('delay', function(){
		return this._delay;
	});

	Timer.charge('repeatCount', function(value){
		this._repeatCount = Type.toInt(value);
		return this;
	});

	Timer.charge('repeatCount', function(){
		return this._repeatCount;
	});

	Timer.charge('running', function(value){
		this._running = Type.toBoolean(value);
		this._running? this.start() : this.stop();
		return this;
	});

	Timer.charge('running', function(){
		return this._running;
	});

	Timer.public('currentCount', function(){
		return this._currentCount;
	});

	Timer.public('duration', function(){
		return this._delay * this._repeatCount;
	});

	Timer.public('time', function(){
		return this._currentCount * this._delay;
	});

	Timer.public('start', function(){
		this._running = true;
		this._lastTime = +new Date();
		this.emit(Timer.START, { target:this });
		if(this._continuous){
			this._continuous = window.setInterval(this.onUpdate);
		}else{
			Ticker.add(this.onUpdate, this);
		}
	});

	Timer.public('stop', function(){
		this._running = false;
		Ticker.remove(this.onUpdate, this);
		window.clearInterval(this._continuous);
		this.emit(Timer.STOP, { target:this });
	});

	Timer.public('reset', function(){
		this._currentCount = 0;
		this._running = false;
		this._lastTime = +new Date();
		this.emit(Timer.RESET, { target:this });
	});

	Timer.public('onUpdate', function(){
		if(this._running && +new Date() - this._lastTime >= this._delay){
			++this._currentCount;
			this._lastTime = +new Date();
			this.emit(Timer.UPDATE, { target:this });
			if(this._repeatCount !== 0 && this._currentCount >= this._repeatCount){
				this.stop();
				this.emit(Timer.COMPLETE, { target:this });
			}
		}
	});

	Ambox.namespace('Timer', Timer);

}).call(this, Ambox);