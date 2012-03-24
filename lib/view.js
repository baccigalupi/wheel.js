jlisten.View = Class.subclass({
  initialize: function(dom, opts) {
    if ( dom && (dom instanceof $ || dom instanceof HTMLElement || dom.toString() === dom) ) {
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
      $.each($(html).find(this.cssSelector), function() {
        set.push(new klass(this, opts));
      });
    }

    return set;
  },

  assemble: function(collection) {
    var set = [];
        klass = this;
    $.each(collection, function(){
      set.push(new klass(this));
    });

    return set;
  }
});

jlisten.View.mixin(jlisten.mixins.Optionize);
