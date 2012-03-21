jlisten.View = Class.subclass({
  initialize: function(dom, opts) {
    this.$ = this.dominator(dom);
    this.optionize(opts);
    this.init();
    this.listen();
  },

  dominator: function(dom) {
    if (dom) {
      return $(dom);
    } else if ( this.template ) {
      return this.render();
    } else {
      throw "initialization with dom element, or template required";
    }
  },

  render: function() {
    return Mustache.render(this.template, this.viewModel());
  },

  viewModel: function() {
    var view;
    if ( this.model != undefined ) {
      view = this.model
    } else if ( this.collection != undefined ) {
      view = this.collection
    } else {
      view = this;
    }
    return view;
  },

  init: function() {
    // placeholder for setting initial state
  },

  listen: function() {
    // placeholder for setting up event listeners on this dom
  }
},{
  // only applicable for finding things in an established dom
  gather: function(html, opts) {
    if (!this.cssSelector) {
      throw "Define a cssSelector on the class to use the 'gather' class method";
    }
    var set = [],
        klass = this;
    opts = opts || {};
    html = $(html);
    if (html.is(this.cssSelector)) {
      set.push(new klass(html, opts));
    } else {
      _.map($(html).find(this.cssSelector), function(dom) {
        set.push(new klass(dom, opts));
      });
    }

    return set;
  }
});

jlisten.View.mixin(jlisten.mixins.Optionize);
