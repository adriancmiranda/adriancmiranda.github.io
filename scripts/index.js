'use strict';

require('trace');
require('Proto');

var Aplication = Proto(function(states){
  this.super(states, 'created');
  this.start();
}).

extends(require('./ambox/index')).

public('load', function(url){
  this.super(url);
}).

public('start', function(){
  this.super();
});

module.exports = new Aplication(require('./portifa/states'));
