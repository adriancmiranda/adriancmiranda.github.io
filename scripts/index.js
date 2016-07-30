'use strict';

require('trace');
require('Proto');

var states = require('./portifa/states');
var Aplication = Proto.extends({
  redditURL: 'ae',

  constructor:function(){
    this.redditURL = 'http://www.reddit.com/r/perfectloops/top.json?sort=top&t=week';
    trace('RedditURL:', this.redditURL);
    trace('States:', states);
  },

  load:function(){
  }
});

module.exports = new Aplication();
