Wheel.Class('Wheel.View', {
  initialize: function(dom, opts) {
    this.initializeDom(dom, opts);
    this.init();
    this.listen();
  },

  initializeDom: function(dom, opts) {
    if ( dom && (dom.addClass || dom instanceof HTMLElement || dom.toString() === dom ) ) {
      this.optionize(opts);
      this.$ = this.wrapDom(dom);
    } else {
      this.optionize(dom);
      this.$ = this.render();
    }
  },

  wrapDom: function(dom) {
    return $(dom);
  },

  render: function(key) {
    var rendered = Mustache.render(this._class.template(key), this.viewModel());
    this.parent && this.appendToParent(rendered);
    return $(rendered);
  },

  appendToParent: function(rendered) {
    this.parent.append ? this.parent.append(rendered) : $(this.parent).append(rendered);
  },

  viewModel: function() {
    var view;
    if ( this.model != undefined ) {
      view = this.model;
    } else {
      view = this;
    }
    return view;
  },


  // delegates to the dom manager
  _delegate: function(method, obj) {
    if ($.isArray(obj)) {
      var self = this;
      $.each(obj, function(index, o) {
        self._delegateOne(method, o);
      });
    } else {
      this._delegateOne(method, obj);
    }
  },

  _delegateOne: function(method, obj) {
    this.$[method](obj.$ || obj);
  },

  append: function(obj) {
    this._delegate('append', obj);
  },

  prepend: function(obj) {
    this._delegate('prepend', obj);
  },

  find: function(obj) {
    this._delegateOne(obj);
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
  },

  templateRepository: function() {
    if (!this._templateRepository) {
      this._templateRepository = window.app && window.app.templates;
    }
    return this._templateRepository;
  },

  templates: function() {
    if (!this._templates) {
      var repository = this.templateRepository();
      this._templates = repository && repository[this.id];
    }
    return this._templates;
  },

  defaultTemplate: 'default',

  template: function(key) {
    var templates = this.templates();
    var template;
    if (templates.toString() === templates) {
      template = templates;
    } else {
      template = key ? templates[key] : templates[this.defaultTemplate];
    }
    return template;
  }
});
