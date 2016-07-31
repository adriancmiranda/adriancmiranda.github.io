/**
 * @author Adrian C. Miranda <adriancmiranda@gmail.com>
 * @see https://github.com/adriancmiranda/console.js
 * @version 1.0.6
 */
(function(global, factory){
  'use strict';

  if(typeof module === 'object' && typeof module.exports === 'object'){
    global.trace = module.exports = factory(global, true).log;
  }else{
    global.trace = factory(global).log;
  }

}(typeof window !== 'undefined' ? window : this, function(global, nodeEnv){
  'use strict';

  var debug = global.location && /\bdebug\b/i.test(global.location.href);
  var slice = Array.prototype.slice;

  function wrap(console, method){
    var output = console[method];
    console[method] = function(){
      if(!console.enabled) return void(0);
      var args = slice.call(arguments);
      if(console.history.length >= console.scrollback){
        console.history.shift();
      }
      console.history.push({ type:method, message:args });
      return output && output.apply(console, args);
    };
  }

  function Logger(console){
    var longMessage = '';
    var methods = 'assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,timeStamp,profile,profileEnd,time,timeEnd,trace,warn,log'.split(',');
    console.enabled = debug || console.enabled;
    while(methods.length){
      wrap(console, methods.pop());
    }
    console.push = function(message){
      longMessage += message +'\n';
    };
    console.flush = function(message){
      console.log(longMessage);
      longMessage = '';
    };
    return console;
  }

  function getConsole(limit){
    try{
      console.log();
      global.console.history = [];
      global.console.scrollback = limit;
      return global.console;
    }catch(error){
      global.console = { history:[], scrollback:limit };
      return global.console;
    }
  }

  return Logger(getConsole(global.console && typeof global.console.scrollback === 'number'?
    global.console.scrollback : 1
  ));
}));
