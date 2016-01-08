/* global Ambox */
(function(Ambox){
	var event = Ambox.namespace('event');
	var Proto = Ambox.namespace('Proto');

	// EventProxy
	// @role IE8 `EventDispatcher` normalized - Thank`s Dean Edwards
	// @see http://caniuse.com/#search=addEventListener
	// @see http://dean.edwards.name/my/events.js
	// @support everywhere
	// @author Dean Edwards
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var EventProxy = new Proto(function EventProxy(target){
		this.target = target||window;
		this.on.guid = 1;
	});

	EventProxy.public('on', function(evt, callback){
		if(!this.target){return;}
		if(this.target.addEventListener){
			this.target.addEventListener(evt, callback, false);
		}else{
			callback._guid = callback._guid||this.on.guid++;
			this.target.events = this.target.events||Proto.create(null);
			if(!this.target.events[evt]){
				this.target.events[evt] = Proto.create(null);
				if(this.target['on'+ evt]){
					this.target.events[evt][0] = this.target['on'+ evt];
				}
			}
			this.target.events[evt][callback._guid] = callback;
			this.target['on'+evt] = this['on.emit'];
		}
		return this;
	});

	EventProxy.public('once', function(evt, callback){
		var self = this;
		this.on(evt, function on(){
			self.off(evt, on);
			callback.apply(this, arguments);
		});
		return this;
	});

	EventProxy.public('emit', function(evt){
		if(this.target.dispatchEvent){
			this.target.dispatchEvent(new Event(evt));
		}else if(this.target['on'+evt]){
			this.target['on'+evt](new Event(evt));
		}
		return this;
	});

	EventProxy.public('on.emit', function(evt){
		evt = evt || event(((this.ownerDocument||this.document||this).parentWindow||window).event);
		var key, listeners = this.events[evt.type];
		for(key in listeners){
			this.__notifier = listeners[key];
			if(this.__notifier(evt) === false){
				return false;
			}
		}
		return true;
	});

	EventProxy.public('off', function(evt, callback){
		if(!this.target){return void(0);}
		if(this.target.removeEventListener){
			this.target.removeEventListener(evt, callback);
		}else if(this.target.events && this.target.events[evt]){
			delete this.target.events[evt][callback._guid];
			delete callback._guid;
		}
		return this;
	});

	Ambox.namespace('EventProxy', EventProxy);

}).call(this, Ambox);
