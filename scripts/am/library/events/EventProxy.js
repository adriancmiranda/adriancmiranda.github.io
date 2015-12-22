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
			callback.__guid = callback.__guid||this.on.guid++;
			this.target.events = this.target.events||{};
			if(!this.target.events[evt]){
				this.target.events[evt] = {};
				if(this.target['on'+ evt]){
					this.target.events[evt][0] = this.target['on'+ evt];
				}
			}
			this.target.events[evt][callback.__guid] = callback;
			this.target['on'+evt] = this.on.notify;
		}
		return this;
	});

	EventProxy.method('trigger', function(evt){
		if(this.target.dispatchEvent){
			this.target.dispatchEvent(new Event(evt));
		}else if(this.target['on'+evt]){
			this.target['on'+evt](new Event(evt));
		}
		return this;
	});

	EventProxy.method('on.notify', function(evt){
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
			delete this.target.events[evt][callback.__guid];
			delete callback.__guid;
		}
		return this;
	});

	return EventProxy;
});
