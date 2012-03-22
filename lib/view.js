jlisten.View = Class.subclass({
  initialize: function(dom, opts) {
    if ( dom instanceof $ || dom instanceof HTMLElement || dom.toString() === dom ) {
      this.optionize(opts);
      this.$ = this.wrapDom(dom);
    } else {
      this.optionize(dom);
      this.$ = this.render()
    }

    this.init();
    this.listen();
  },

  wrapDom: function(dom) {
    return $(dom);
  },

  render: function() {
    return $(Mustache.render(this._class.template(), this.viewModel()));
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
  },

  assemble: function(collection) {
    var set = [];
        klass = this;
    _.each(collection, function(opts){
      set.push(new klass(opts));
    });

    return set;
  }
});

jlisten.View.mixin(jlisten.mixins.Optionize);
