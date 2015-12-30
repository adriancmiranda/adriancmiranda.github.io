define([
	'./event',
	'../utils/Class'
], function(event, Class){

	var EventProxy = new Class(function EventProxy(target){
		this.target = target||window;
		this.on.guid = 1;
	});

	EventProxy.method('on', function(evt, callback){
		if(!this.target){return;}
		if(this.target.addEventListener){
			this.target.addEventListener(evt, callback, false);
		}else{
			callback._guid = callback._guid||this.on.guid++;
			this.target.events = this.target.events||{};
			if(!this.target.events[evt]){
				this.target.events[evt] = {};
				if(this.target['on'+ evt]){
					this.target.events[evt][0] = this.target['on'+ evt];
				}
			}
			this.target.events[evt][callback._guid] = callback;
			this.target['on'+evt] = this['on.emit'];
		}
		return this;
	});

	EventProxy.method('once', function(evt, callback){
		var self = this;
		this.on(evt, function on(){
			self.off(evt, on);
			callback.apply(this, arguments);
		});
		return this;
	});

	EventProxy.method('emit', function(evt){
		if(this.target.dispatchEvent){
			this.target.dispatchEvent(new Event(evt));
		}else if(this.target['on'+evt]){
			this.target['on'+evt](new Event(evt));
		}
		return this;
	});

	EventProxy.method('on.emit', function(evt){
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

	EventProxy.method('off', function(evt, callback){
		if(!this.target){return void(0);}
		if(this.target.removeEventListener){
			this.target.removeEventListener(evt, callback);
		}else if(this.target.events && this.target.events[evt]){
			delete this.target.events[evt][callback._guid];
			delete callback._guid;
		}
		return this;
	});

	return EventProxy;
});
