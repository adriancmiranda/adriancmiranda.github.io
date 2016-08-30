define([
  'scope',
  'library/display/View'
], function(scope, View){

  var Archives = new Proto(function(options){
    this.super(options);
  }).extends(View);

  Archives.method('attach', function(){
  });

  Archives.method('detach', function(){
  });

  Archives.method('transitionIn', function(done){
    TweenLite.to(this.node, 0.4, { alpha:1, onComplete:done });
  });

  Archives.method('transitionOut', function(done){
    TweenLite.to(this.node, 0.4, { alpha:0, onComplete:done });
  });

  Archives.method('rendering', function(){
  });

  Archives.method('arrange', function(){
  });

  return Archives;
});
