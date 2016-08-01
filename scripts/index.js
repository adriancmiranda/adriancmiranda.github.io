'use strict';

require('trace');
require('Proto');

// teste
var Aplication = Proto(function(states){
  this.super(states, 'created');
  trace(this.bind)
  this.start();
}).extends(require('./ambox/index')).

// teste
public('load', function(url){
  this.super(url);
}).

// teste
public('start', function(){
  this.super();
});

module.exports = global.app = new Aplication(require('./portifa/states'));
console.log('Aplication:', module.exports);
