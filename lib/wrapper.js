jlisten.ViewWrapper = Class.subclass({
  initialize: function(dom, opts) {
    this.$ = this.dominator(dom);
    this.optionize(opts);
    this.init();
    this.listen();
  },

  dominator: function(dom) {
    return $(dom);
  },

  init: function() {
    // placeholder for setting initial state
  },

  listen: function() {
    // placeholder for setting up event listeners on this dom
  }
});

jlisten.ViewWrapper.mixin(jlisten.mixins.Optionize);
