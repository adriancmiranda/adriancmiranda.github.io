define([
	'../common/patterns',
	'../utils/Map',
	'../utils/Type',
	'../utils/Class',
	'../utils/Vendor'
], function(patterns, Map, Type, Class, Vendor){
	'use strict';

	var Element = new Class(function Element(node){
		this.node = this.ensureElement(node);
	});

	Element.static('getWindow', function(node){
		var ownerDoc = node.ownerDocument;
		var windowEl = Type.isWindow(ownerDoc) && ownerDoc;
		var isDoc = Type.isDocument(ownerDoc);
		return(windowEl || isDoc && (ownerDoc.defaultView||ownerDoc.parentWindow));
	});

	Element.static('getStyle', function(node){
		var windowEl = this.getWindow(node);
		if(windowEl && windowEl.opener && windowEl.getComputedStyle){
			return windowEl.getComputedStyle(node, null);
		}else if(window.getComputedStyle){
			return window.getComputedStyle(node, null);
		}else if(node.currentStyle){
			return node.currentStyle;
		}
		return node.style;
	});

	Element.static('support', function(value){
		var has3d, node = document.createElement('i');
		if(Type.isString(value) && patterns.support3d.test(value)){
			this.css(node, 'display', 'block');
			document.body.insertBefore(node, null);
			this.css(node, 'transform', 'translate3d(1px,1px,1px)');
			has3d = this.css(node, 'transform');
			document.body.removeChild(node);
			return(has3d !== null && has3d.length && has3d !== 'none');
		}
		return Type.isDefined(Vendor(node.style, value));
	});

	Element.static('supportTransition', function(){
		if(Type.isDefined(this.hasCSSTransition)){
			return this.hasCSSTransition;
		}
		this.hasCSSTransition = this.support(['transitionProperty', 'transition']);
		return this.hasCSSTransition;
	});

	Element.static('supportTransform', function(){
		if(Type.isDefined(this.hasCSS2d)){
			return this.hasCSS2d;
		}
		this.hasCSS2d = this.support('transform');
		return this.hasCSS2d;
	});

	Element.static('supportTransform3D', function(){
		if(Type.isDefined(this.hasCSS3d)){
			return this.hasCSS3d;
		}
		this.hasCSS3d = this.support('3d');
		return this.hasCSS3d;
	});

	Element.static('css', function(node, prop, value){
		if(Type.isUndefined(value)){
			return Vendor(this.getStyle(node), prop);
		}
		node.style[Vendor.prefixed(node.style, prop)] = value;
	});

	Element.static('nodeName', function(node, expected){
		var name = (node.nodeName||'');
		if(Type.isUndefined(expected)){
			return name;
		}
		return name.toLowerCase() === expected.toLowerCase();
	});

	Element.method('ensureElement', function(node){
		return Type.isElement(node) ? node : this.createDefaultNode();
	});

	Element.method('createDefaultNode', function(){
		return document.createElement('div');
	});

	Element.method('removeClass', function(className){
		if('classList' in document.documentElement){
			this.node.classList.remove(className);
		}else{
			this.node.className = this.node.className.replace(
				patterns.findClass(className), ' '
			);
		}
		return this;
	});

	Element.method('addClass', function(className){
		if('classList' in document.documentElement){
			this.node.classList.add(className);
		}else if(!this.hasClass(className)){
			this.node.className = this.node.className +' '+ className;
		}
		return this;
	});

	Element.method('hasClass', function(className){
		if('classList' in document.documentElement){
			return this.node.classList.contains(className);
		}
		return patterns.findClass(className).test(this.node.className);
	});

	Element.method('toggleClass', function(className){
		var fn = this.hasClass(className) ? this.removeClass : this.addClass;
		return fn(className);
	});

	Element.charge('css', function(prop){
		return Element.css(this.node, prop);
	});

	Element.charge('css', function(prop, value){
		Element.css(this.node, prop, value);
		return this;
	});

	Element.charge('attr', function(name){
		return this.node.getAttribute(name);
	});

	Element.charge('attr', function(name, value){
		this.node.setAttribute(name, value);
		return this;
	});

	Element.method('removeAttr', function(value){
		var name, propName, id = 0;
		var attrNames = value && value.match(patterns.whiteSpace);
		Map.array(attrNames, function(attr){
			if(patterns.isBoolAttr.test(attr)){
				this.node[attr] = false;
			}
			this.node.removeAttribute(attr);
		}, this);
	});

	Element.charge('data', function(name){
		return this.attr('data-'+name);
	});

	Element.charge('data', function(name, value){
		return this.attr('data-'+name, value);
	});

	Element.charge('width', function(){
		var bcr = this.node.getBoundingClientRect;
		return this.node.offsetWidth||bcr().width;
	});

	Element.charge('width', function(value){
		this.css('width', Type.toCSSMeasure(value));
		return this;
	});

	Element.charge('height', function(){
		var bcr = this.node.getBoundingClientRect;
		return this.node.offsetHeight||bcr().height;
	});

	Element.charge('height', function(value){
		this.css('height', Type.toCSSMeasure(value));
		return this;
	});

	Element.method('offset', function(){
		var bcr, offset = { left:0, top:0 };
		var windowEl = Element.getWindow(this.node);
		var docEl = this.node.ownerDocument.documentElement;
		if(Type.isFunction(this.node.getBoundingClientRect)){
			bcr = this.node.getBoundingClientRect();
		}
		offset.left = bcr.left + windowEl.pageXOffset - docEl.clientLeft;
		offset.top = bcr.top + windowEl.pageYOffset - docEl.clientTop;
		return offset;
	});

	Element.method('offsetParent', function(){
		var docEl = window.document.documentElement;
		var parent = this.node.offsetParent||docEl;
		while(parent && (!Element.nodeName(parent, 'html') && Element.css(parent, 'position') === 'static')){
			parent = parent.offsetParent;
		}
		return new Element(parent||docEl);
	});

	Element.method('position', function(){
		var offset, offsetParent, position = { top:0, left:0 };
		if(this.css('position') === 'fixed'){
			offset = this.node.getBoundingClientRect();
		}else{
			offsetParent = this.offsetParent();
			offset = this.offset();
			if(!Element.nodeName(offsetParent.node, 'html')){
				position = offsetParent.offset();
			}
			position.left += Type.toFloat(offsetParent.css('borderLeftWidth'));
			position.top += Type.toFloat(offsetParent.css('borderTopWidth'));
		}
		position.left = offset.left - position.left - Type.toFloat(this.css('marginLeft'));
		position.top = offset.top - position.top - Type.toFloat(this.css('marginTop'));
		return position;
	});

	Element.method('translate', function(axis, durationMS){
		axis = Type.isObject(axis) ? axis : {};
		axis.x = Type.toCSSMeasure(axis.x);
		axis.y = Type.toCSSMeasure(axis.y);
		axis.z = Type.toCSSMeasure(axis.z);
		this.css('transitionDuration', (Type.isUint(durationMS) ? durationMS : 0)+'ms');
		if(Element.supportTransform3D()){
			this.css('transform', 'translate3d('+axis.x+', '+axis.y+', '+axis.z+')');
		}else if(Element.supportTransform()){
			this.css('transform', 'translateX('+axis.x+') translateY('+axis.y+') translateZ('+axis.z+')');
		}else{
			// JS Tween
		}
	});

	return Element;
});
