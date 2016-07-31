'use strict';

require('trace');
require('Proto');

var Aplication = new Proto(function Aplication(states){
  this.super(states, 'created');
  this.redditURL = 'http://www.reddit.com/r/perfectloops/top.json?sort=top&t=week';
  // this.start();
})

.extends(require('./ambox/index'))
.public('load', function(url){
  console.log('Aplication.load(%s)', url);
  this.super(url);
})

.public('start', function(){
  console.log('Aplication.start');
  this.super();
})


module.exports = new Aplication(require('./portifa/states'));
console.log('--');
console.log('aplication:', module.exports);
console.log('aplication.teste:', module.exports.load('http://teste.com'));
console.log('aplication.teste:', module.exports.teste);
