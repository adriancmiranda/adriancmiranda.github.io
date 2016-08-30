define([
  'scope',
  'library/display/View'
], function(scope, View){

  function Contact(options){
    /**
     *
     */
    this.attach = function(){
      console.log('attached!');
    };

    /**
     *
     */
    this.detach = function(){
      console.log('detached!');
    };

    /**
     *
     */
    this.transitionIn = function(done){
      TweenLite.to(this.node, 0.4, { alpha:1, onComplete:done });
    };

    /**
     *
     */
    this.transitionOut = function(done){
      TweenLite.to(this.node, 0.4, { alpha:0, onComplete:done });
    };

    /**
     *
     */
    this.rendering = function(){
    };

    /**
     *
     */
    this.arrange = function(){
      trace('%ix%i', window.innerWidth, window.innerHeight);
    };

    Contact.prototype = new View(options);
  }


  return Contact;
});
