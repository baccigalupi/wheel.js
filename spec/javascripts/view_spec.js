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

    describe("gather", function() {
      var dom;
      beforeEach(function () {
        dom =
        "  <ul class='lister'>" +
        "    <li class='item'>one</li>" +
        "    <li class='seperator'></li>" +
        "    <li class='item'>two</li>" +
        "  </ul>";
      });

      describe("failure", function () {
        it("requires a selector", function () {
          var raises = false;
          try {
            Wrap.gather(dom);
          } catch (e) {
            raises = true;
            expect(e).toBe("Define a cssSelector on the class to use the 'gather' class method");
          }
          expect(raises).toBe(true);
        });
      });

      describe('success', function () {
        var gathered;
        beforeEach(function() {
          Wrap.cssSelector = 'li.item';
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
    });
  });

  describe('appenders', function() {
    var Pender, pender, Pendee;

    beforeEach(function() {
      Pender = Wheel.View.subclass({}, {
        template: function() {
          return "<div class='pender'/>"
        }
      });

      Pendee = Wheel.View.subclass({}, {
        template: function() {
          return "<div class='pendee'/>"
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
          var pendees = Pendee.assemble([{},{}]);
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
        it('fails', function() {
          var templates = {
            'create': '<form class="new_thing"><input type="submit" value="Make a new thingy!"/></form>',
            'default': '<div class="thing">Thingy</div>'
          };
          View = Wheel.View.subclass('View');
          View.templates = function() {
            return templates;
          };

          var view = View.build();

          expect(view.render('create').attr('class')).toBe('new_thing');
        });
      });
    });

    describe('assemble class method', function() {
      var ListItem;

      beforeEach(function(){
        ListItem = Wheel.View.subclass({},{
          template: function() {
            return "<li class='list_item'>{{first_name}} {{last_name}}</li>";
          }
        });
      });

      describe("when passed an array", function() {
        var list;

        beforeEach(function() {
          list = ListItem.assemble([{
            model: {
              first_name: 'Herman', last_name: 'Melville'
            }},{
            model: {
              first_name: 'Nathaniel', last_name: 'Hawthorne'
            }
          }]);
        });

        it("returns an array of instances", function() {
          expect(list.length).toBe(2);
          expect(list[0] instanceof ListItem).toBe(true);
          expect(list[1] instanceof ListItem).toBe(true);
        });

        it("instances are initialized with the correct instance variables", function() {
          expect(list[0].model.first_name).toBe('Herman');
          expect(list[0].model.last_name).toBe('Melville');

          expect(list[1].model.first_name).toBe('Nathaniel');
          expect(list[1].model.last_name).toBe('Hawthorne');
        });

        it("renders each correctly", function() {
          // Zepto fails with list[0].$.is('li.list_item')

          expect(list[0].$.hasClass('list_item')).toBe(true);
          expect(list[0].$.text()).toBe("Herman Melville");

          expect(list[1].$.hasClass('list_item')).toBe(true);
          expect(list[1].$.text()).toBe("Nathaniel Hawthorne");
        });
      });
    });
  });

  describe('templates', function() {
    var View, repository;

    it('repository defaults to the apps templates object', function() {
      repository = {foo: 'bar'};
      window.app = {
        templates: repository
      };

      View = Wheel.View.subclass();
      expect(View.templateRepository()).toBe(repository);
    });

    it('asks the Templates respitory for templates related to its class', function() {
      repository = {
        'View': {
          'create': '<form class="new_thing"><input type="submit" value="Make a new thingy!"/></form>',
          'default': '<div class="thing">Thingy</div>'
        }
      };
      View = Wheel.View.subclass('View');
      View.templateRepository = function() { return repository; };
      expect(View.templates()).toEqual(repository['View']);
    });

    describe('#templates', function() {
      var fullRepo = {
        'View': {
          'create': '<form class="new_thing"><input type="submit" value="Make a new thingy!"/></form>',
          'default': '<div class="thing">Thingy</div>'
        }
      };

      beforeEach(function() {
        View = Wheel.View.subclass('View');
        View.templateRepository = function() { return repository; };
      });

      it('will return the #templates if it is a string', function() {
        repository = { View: "<div class='thingy'>Thingy</div>" };

        expect(View.template()).toBe(repository['View']);
      });

      it('will return the default view if templates is a hash', function() {
        repository = fullRepo;
        expect(View.template()).toBe(repository['View']['default']);
      });

      it('will return an alternate view when passed a key argument', function() {
        repository = fullRepo;
        expect(View.template('create')).toBe(repository['View']['create']);
      });

      it('view class can customize its default template', function() {
        repository = fullRepo;
        View.defaultTemplate = 'create';
        expect(View.template()).toBe(repository['View']['create']);
      });
    });
  });
});
