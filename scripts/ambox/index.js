'use strict';

var Ambox = function(states, status){
  console.log('Ambox created with %o. Status: %o', states, status);
};

Ambox.prototype = {
  teste:function(){trace('Ambox.teste: called!');},
  start:function(){trace('Ambox.start: called!');},
  load:function(url){trace('Ambox.load(%s)', url);}
};

module.exports = Ambox;
