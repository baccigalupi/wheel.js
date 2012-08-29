describe("Wheel.View", function () {
  describe("initialization", function () {
    var view;
    beforeEach(function() {
      spyOn(Wheel.View.prototype, 'init');
      spyOn(Wheel.View.prototype, 'listen');
      view = new Wheel.View('<span></span>',{
        thingy: true,
        that: function() {return 'that';}
      });
    });

    it("stores options passed in as instance attributes", function() {
      expect(view.thingy).toBe(true);
      expect(view.that()).toBe('that');
    });

    it('sets the unique id', function() {
      expect(view._uid).not.toBeFalsy();
    });

    it("calls init", function () {
      expect(Wheel.View.prototype.init).toHaveBeenCalled();
    });

    it("calls listen", function () {
      expect(Wheel.View.prototype.listen).toHaveBeenCalled();
    });
  });

  describe("as a wrapper for existing dom", function () {
    var Wrap, wrap;

    beforeEach(function() {
      Wrap = Wheel.View.subclass();
    });

    describe("initalization with dom", function() {
      beforeEach(function() {
        wrap = new Wrap('<div class="wrap" id="View"></div>', {
          thingy: true,
          that: function() {return 'that';}
        });
      });

      it("wraps a reference to the dom", function () {
        expect(wrap.$.hasClass('wrap')).toBe(true);
      });
    });
  });

  describe('appenders', function() {
    var Pender, pender, Pendee;

    beforeEach(function() {
      Pender = Wheel.View.subclass({}, {
        template: function() {
          return "<div class='pender'/>";
        }
      });

      Pendee = Wheel.View.subclass({}, {
        template: function() {
          return "<div class='pendee'/>";
        }
      });

      pender = new Pender();
    });

    describe('append', function() {
      describe("single argument", function(){
        it("can append a Wheel.View object", function() {
          pender.append(new Pendee());
          expect(pender.$.find('.pendee').length).toBe(1);
        });

        it('can append a dom element', function() {
          pender.append("<div class='not_pendee'/>");
          expect(pender.$.find('.not_pendee').length).toBe(1);
        });
      });

      describe("array argument", function(){
        it("can append an array of Wheel.View object", function() {
          var pendees = [
            Pendee.build({}),
            Pendee.build({})
          ];
          pender.append(pendees);
          expect(pender.$.find('.pendee').length).toBe(2);
        });

        it('can append an array of dom element', function() {
          var pendees = ['<div class="foo"/>', '<div class="bar"/>'];
          pender.append(pendees);
          expect(pender.$.find('.foo').length).toBe(1);
          expect(pender.$.find('.bar').length).toBe(1);
        });
      });
    });

    xdescribe('prepend', function() {
      describe("single argument", function(){
        it("can append a Wheel.View object");
        it('can append a dom element');
      });
      describe("array argument", function(){
        it("can append an array of Wheel.View object");
        it('can append an array of dom element');
      });
    });
  });

  describe('as a builder of html', function() {
    var Builder, builder;

    beforeEach(function() {
      Builder = Wheel.View.subclass({}, {
        template: function() {
          return "<div class='builder'></div>";
        }
      });

      builder = new Builder({canHas: true});
    });

    describe('initialize', function() {
      it("gets sets the right instance attributes", function () {
        expect(builder.canHas).toBe(true);
      });

      it("has builds the right dom", function() {
        expect(builder.$.is('div.builder')).toBe(true);
      });
    });

    describe("rendering", function() {
      var Lister, list, rendered;
      beforeEach(function() {
        Lister = Wheel.View.subclass({
          title: function() {
            return this.collection.length + " Authors";
          }
        },{
          template: function() {
            return "<div class='list_container'>"+
            "<h1>{{title}}</h1>" +
            "  <ul class='authors'>" +
            "  {{#collection}}" +
            "    <li>{{first_name}} {{last_name}}</li>" +
            "  {{/collection}}" +
            "  </ul></div>" +
            "</div>";
          }
        });
      });

      describe("using self as the view class", function () {
        beforeEach(function () {
          list = new Lister({collection: [
            {first_name: 'Herman', last_name: 'Melville'},
            {first_name: 'Nathaniel', last_name: 'Hawthorne'}
          ]});

          rendered = list.$.html();
        });

        it("renders passed in attributes", function () {
          expect(rendered).toMatch(/<li>Herman Melville<\/li>/);
          expect(rendered).toMatch(/<li>Nathaniel Hawthorne<\/li>/);
        });

        it("renders methods correctly", function () {
          expect(rendered).toMatch(/<h1>2 Authors<\/h1>/);
        });
      });

      describe("using a model as the view class", function() {
        beforeEach(function () {
          list = new Lister({model: {
            title: 'Some Authors',
            collection: [
              {first_name: 'Edgar Allen', last_name: 'Poe'},
              {first_name: 'Mark', last_name: 'Twain'}
            ]
          }});

          rendered = list.$.html();
        });

        it("renders correctly", function () {
          expect(rendered).toMatch(/<h1>Some Authors<\/h1>/);
          expect(rendered).toMatch(/<li>Edgar Allen Poe<\/li>/);
          expect(rendered).toMatch(/<li>Mark Twain<\/li>/);
        });
      });

      describe("customizing the view class", function() {
        var SubLister, subview;

        beforeEach(function() {
          SubLister = Lister.subclass({
            viewModel: function() {
              return {
                title: "America! It's Authors!",
                collection: [
                  {first_name: 'Herman', last_name: 'Melville'},
                  {first_name: 'Nathaniel', last_name: 'Hawthorne'},
                  {first_name: 'Edgar Allen', last_name: 'Poe'},
                  {first_name: 'Mark', last_name: 'Twain'}
                ]
              };
            }
          });

          subview = new SubLister();
          rendered = subview.$.html();
        });

        it("renders correctly", function () {
          expect(rendered).toMatch(/<h1>America! It's Authors!<\/h1>/);
          expect(rendered).toMatch(/<li>Edgar Allen Poe<\/li>/);
          expect(rendered).toMatch(/<li>Mark Twain<\/li>/);
          expect(rendered).toMatch(/<li>Herman Melville<\/li>/);
          expect(rendered).toMatch(/<li>Nathaniel Hawthorne<\/li>/);
        });
      });

      describe('auto appending', function() {
        var parent;

        it('will append itself to the parent option element', function() {
          parent = $("<div class='parent'/>");
          list = new Lister({parent: parent, model: {
            title: 'Some Authors',
            collection: [
              {first_name: 'Edgar Allen', last_name: 'Poe'},
              {first_name: 'Mark', last_name: 'Twain'}
            ]
          }});
          expect(parent.find('ul.authors').length).toBe(1);
        });

        it('will append itself to a Wheel.View', function() {
          parent = new Lister({model: {title: 'Favorite Authors', collection: [
            {first_name: 'Herman', last_name: 'Melville'}
          ]}});

          list = new Lister({
            parent: parent,
            model: {
              title: 'Other Authors',
              collection: [
                {first_name: 'Stephen', last_name: 'King'}
              ]
            }
          });

          expect(parent.$.find('ul.authors').length).toBe(2);
        });
      });

      describe('rendering non-default templates', function() {
        var View;
        beforeEach(function() {
          View = Wheel.View.subclass('View');
          var templates = {
            'create': '<form class="new_thing">{{message}}<input type="submit" value="Make a new thingy!"/></form>',
            'default': '<div class="thing">Thingy</div>'
          };
          View.templates = function() {
            return templates;
          };
        });

        it('works', function() {
          var view = View.build();
          expect(view.renderTemplate('create').attr('class')).toBe('new_thing');
        });

        it('data can be passed in too', function() {
          var view = View.build();
          expect(view.renderTemplate('create', {message: 'Do something'}).text()).toMatch(/Do something/);
        });
      });
    });
  });

  describe('templates', function() {
    var App, app, View, repository;
    beforeEach(function() {
      repository = {
        'App.View': {
          'create': '<form class="new_thing"><input type="submit" value="Make a new thingy!"/></form>',
          'default': '<div class="thing">Thingy</div>'
        }
      };

      App = Wheel.App.subclass('App');
      View = Wheel.View.subclass('App.View');

      app = App.build();
      app.templates.append(repository);
    });

    afterEach(function() {
    });

    it('repository defaults to the app\'s templates object', function() {
      expect(View.templateRepository()).toBe(app.templates);
    });

    it('asks the template\'s respitory for templates related to its class', function() {
      expect(View.templates()).toEqual(repository['App.View']);
    });

    describe('#template', function() {
      it('will return the default view if templates is a hash', function() {
        expect(View.template()).toBe(repository['App.View']['default']);
      });

      it('will return an alternate view when passed a key argument', function() {
        expect(View.template('create')).toBe(repository['App.View']['create']);
      });

      it('view class can customize its default template', function() {
        View.defaultTemplate = 'create';
        expect(View.template()).toBe(repository['App.View']['create']);
      });

      it('will return the template if it is a string', function() {
        app.templates['App']['View'] = "<div class='view'>view</div>";
        expect(View.template()).toBe("<div class='view'>view</div>");

        // cleanup
        app.templates['App']['View'] = repository['App.View'];
      });

      describe('when the parent class also has templates', function() {
        var SubView;
        beforeEach(function() {
          SubView = View.subclass('App.SubView');
          app.templates.append({'App.SubView': {
            'default': '<div class="thangy">Thangy</div>'
          }});
        });

        it('should include its own view', function() {
          expect(SubView.templates()['default']).toBe(app.templates['App']['SubView']['default']);
        });

        it('should include non-colliding parent views', function() {
          expect(SubView.templates().create).toBe(app.templates['App']['View']['create']);
        });
      });
    });
  });

  describe('gathering existing dom', function() {
    var Wrap, wrap, dom;

    beforeEach(function() {
      Wrap = Wheel.View.subclass();
      dom =
      "  <ul class='lister'>" +
      "    <li class='item'>one</li>" +
      "    <li class='seperator'></li>" +
      "    <li class='item'>two</li>" +
      "  </ul>";
    });

    it("requires a selector", function () {
      var raises = false;
      try {
        Wrap.gather(dom);
      } catch (e) {
        raises = true;
        expect(e).toBe("Define a selector on the class to use the 'gather' class method");
      }
      expect(raises).toBe(true);
    });

    describe('with a selector defined', function () {
      var gathered;
      beforeEach(function() {
        Wrap.selector = 'li.item';
      });

      describe('given a parent element', function () {
        beforeEach(function() {
          gathered = Wrap.gather(dom);
        });

        it("finds the right number of elements", function () {
          expect(gathered.length).toBe(2);
        });

        it("creates the right kind of object", function () {
          expect(gathered[0] instanceof Wrap).toBe(true);
          expect(gathered[1] instanceof Wrap).toBe(true);
        });

        it("creates objects with the correct dom", function() {
          expect(gathered[0].$.is('li.item')).toBeTruthy();
          expect(gathered[1].$.is('li.item')).toBeTruthy();
          expect(gathered[0].$.text()).toBe('one');
          expect(gathered[1].$.text()).toBe('two');
        });
      });

      describe('given the element itself', function() {
        var wrap;
        beforeEach(function() {
          gathered = Wrap.gather($(dom).find('li.item')[0]);
          wrap = gathered[0];
        });

        it('returns only one object in the array', function() {
          expect(gathered.length).toBe(1);
        });

        it('the object is the right type', function() {
          expect(wrap instanceof Wrap).toBeTruthy();
        });

        it('the object has the right dom', function() {
          expect(wrap.$.is('li.item')).toBeTruthy();
        });
      });
    });

    describe('when not given a dom', function() {
      beforeEach(function() {
        dom = $(dom);
        dom.css('display', 'none');
        $(document.body).append(dom);
        Wrap.selector = 'li.item';
        gathered = Wrap.gather({foo: 'bar'});
        wrap = gathered[0];
      });

      afterEach(function() {
        dom.remove();
      });

      it('will use the document to search', function() {
        expect(gathered.length).toBe(2);
        expect(wrap).toBeA(Wrap);
        expect(wrap.$.is('li.item')).toBe(true);
      });

      it('will still get its data', function() {
        expect(wrap.foo).toBe('bar');
      });
    });
  });

  describe('assembling views from a collection of models', function() {
    var Assembler, assembled, Task, tasks, parent, opts;
    beforeEach(function() {
      parent = $('<ul class="tasks"></ul>');

      Task = Wheel.Model.subclass({
        properties: ['name']
      });

      tasks = Task.build([
        {name: 'Do the dishes'},
        {name: 'Make dinner'}
      ]);

      Assembler = Wheel.View.subclass();
      Assembler.template = function() {
        return "<li class='task'>{{name}}</task>";
      };

      opts = {
        parent: parent,
        foo: 'bar'
      };
    });

    it('return an array of views', function() {
      assembled = Assembler.assemble(tasks);
      expect(assembled.length).toBe(2);
      expect(assembled[0]).toBeA(Assembler);
    });

    it('takes in other options', function() {
      assembled = Assembler.assemble(tasks, opts);
      expect(assembled[0].parent).toBe(parent);
      expect(assembled[0].foo).toBe('bar');
      expect(assembled[1].parent).toBe(parent);
      expect(assembled[1].foo).toBe('bar');
    });
  });
});
