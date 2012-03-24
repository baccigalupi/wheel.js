jlisten.View = Class.subclass({
  initialize: function(dom, opts) {
    if ( dom && (dom.addClass || dom instanceof HTMLElement || dom.toString() === dom) ) {
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
    var rendered = Mustache.render(this._class.template(), this.viewModel());
    return $(rendered);
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
  gather: function(dom, opts) {
    if (!this.cssSelector) {
      throw "Define a cssSelector on the class to use the 'gather' class method";
    }
    var set = [],
        klass = this;
    opts = opts || {};
    dom = (dom instanceof $) ? dom : $(dom);

    if (dom.is(this.cssSelector)) {
      set.push(new klass(dom, opts));
    } else {
      $.each(dom.find(this.cssSelector), function(index, item) {
        set.push(new klass(item, opts));
      });
    }

    return set;
  },

  assemble: function(collection) {
    var set = [];
        klass = this;
    $.each(collection, function(index, item){
      set.push(new klass(item));
    });

    return set;
  }
});

jlisten.View.mixin(jlisten.mixins.Optionize);
