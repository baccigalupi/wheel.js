Wheel.Class('Wheel.View', {
  initialize: function(dom, opts) {
    this.initializeDom(dom, opts);
    this.init();
    this._postInit();
  },

  initializeDom: function(dom, opts) {
    if ( dom && (dom.addClass || dom instanceof HTMLElement || Wheel.isString(dom) ) ) {
      this._preInit(opts);
      this.$ = this.wrapDom(dom);
    } else {
      this._preInit(dom);
      this.$ = this.renderDefault();
    }
  },

  wrapDom: function(dom) {
    return $(dom);
  },

  renderDefault: function() {
    var rendered = this.renderTemplate();
    this.parent && this.appendToParent(rendered);
    return rendered;
  },

  renderTemplate: function(keyOrData, data) {
    var key;
    if ( Wheel.isString(keyOrData) ) {
      key = keyOrData;
    } else {
      data = keyOrData;
    }
    return $(Mustache.render(this._class.template(key), data || this.viewModel()));
  },

  appendToParent: function(rendered) {
    this.parent.append ? this.parent.append(rendered) : $(this.parent).append(rendered);
  },

  viewModel: function() {
    var view;
    if ( this.model ) {
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
  }
},{
  templateRepository: function() {
    if (!this._templateRepository) {
      this._templateRepository = this._getTemplateRepository();
    }
    return this._templateRepository;
  },

  _getTemplateRepository: function() {
    return this.App && this.App.app && this.App.app.templates;
  },

  templates: function() {
    if (!this._templates && this !== Wheel.View) {
      this._templates = Wheel.Utils.ObjectPath.read(this.id, this.templateRepository());
      var superTemplates = this.superclass.templates && this.superclass.templates();
      if (superTemplates && this._templates) {
        var key;
        for(key in superTemplates) {
          if (!this._templates[key]) { this._templates[key] = superTemplates[key]; }
        }
      }
    }
    return this._templates;
  },

  defaultTemplate: 'default',

  template: function(key) {
    var templates = this.templates();
    if (!templates) {
      throw "No templates found for View: " + this.id;
    }
    var template;
    if (Wheel.isString(templates)) {
      template = templates;
    } else {
      template = key ? templates[key] : templates[this.defaultTemplate];
    }
    return template;
  },

  // only applicable for finding things in an established dom
  gather: function(dom, opts) {
    if (!this.selector) {
      throw "Define a selector on the class to use the 'gather' class method";
    }
    var set = [],
        klass = this;
    if (Wheel.isObject(dom) && !Wheel.isElement(dom)) {
      opts = dom;
      dom = $(document.body);
    } else {
      opts = opts || {};
      dom = Wheel.is$(dom) ? dom : $(dom);
    }

    if (dom.is(this.selector)) {
      set.push(new klass(dom, opts));
    } else {
      $.each(dom.find(this.selector), function(index, item) {
        set.push(new klass(item, opts));
      });
    }

    return set;
  },

  assemble: function(models, opts) {
    var views = [];
    opts = opts || {};
    $.each(models, function(i, model) {
      opts.model = model;
      views.push(this.build(opts));
    }.bind(this));
    return views;
  }
});
