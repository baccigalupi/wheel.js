jlisten.Wrapper = Class.subclass({
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
},{
  gather: function(html) {
    if (!this.cssSelector) {
      throw "Define a cssSelector on the class to use the 'gather' class method";
    }
    var set = [],
        klass = this;
    _.map($(html).find(this.cssSelector), function(dom) {
      set.push(new klass(dom));
    });

    return set;
  }
});

jlisten.Wrapper.mixin(jlisten.mixins.Optionize);
