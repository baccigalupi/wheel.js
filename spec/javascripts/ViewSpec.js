describe("jlisten.View", function () {
  describe("initialization", function () {
    var view;
    beforeEach(function() {
      spyOn(jlisten.View.prototype, 'init');
      spyOn(jlisten.View.prototype, 'listen');
      view = new jlisten.View('<span></span>',{
        thingy: true,
        that: function() {return 'that';}
      });
    });

    it("stores options passed in as instance attributes", function() {
      expect(view.thingy).toBe(true);
      expect(view.that()).toBe('that');
    });

    it("calls init", function () {
      expect(jlisten.View.prototype.init).toHaveBeenCalled();
    });

    it("calls listen", function () {
      expect(jlisten.View.prototype.listen).toHaveBeenCalled();
    });
  });

  describe("as a wrapper for existing dom", function () {
    var Wrap, wrap;

    beforeEach(function() {
      Wrap = jlisten.View.subclass();
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
      var html;
      beforeEach(function () {
        html =
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
            Wrap.gather(html);
          } catch (e) {
            raises = true;
            expect(e).toBe("Define a cssSelector on the class to use the 'gather' class method");
          }
          expect(raises).toBe(true);

          //expect(Wrap.gather(html)).toThrow("Define a cssSelector on the class to use the 'gather' class method");
        });
      });

      describe('success', function () {
        var gathered;
        beforeEach(function() {
          Wrap.cssSelector = 'li.item';
        });

        describe('given a parent element', function () {
          beforeEach(function() {
            gathered = Wrap.gather(html);
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
            gathered = Wrap.gather($(html).find('li.item')[0]);
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

  xdescribe('appenders', function() {
    describe('append', function() {
      describe("single argument", function(){
        it("can append a jlisten.View object");
        it('can append a dom element');
        it('can append a wrapped dom element');
        it('can append a string');
      });
      describe("array argument", function(){
        it("can append an array of jlisten.View object");
        it('can append an array of wrapped dom element');
      });
    });
    describe('prepend', function() {
      describe("single argument", function(){
        it("can prepend a jlisten.View object");
        it('can prepend a dom element');
        it('can prepend a wrapped dom element');
        it('can prepend a string');
      });
      describe("array argument", function(){
        it("can prepend an array of jlisten.View object");
        it('can prepend an array of wrapped dom element');
      });
    });
  });

  describe('as a builder of html', function() {
    var Builder, builder;

    beforeEach(function() {
      Builder = jlisten.View.subclass({}, {
        template: function() {
          return "<div class='builder'></div>"
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
        Lister = jlisten.View.subclass({
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
            "</div>"
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
          expect(rendered).toMatch(/<li>Herman Melville<\/li>/)
          expect(rendered).toMatch(/<li>Nathaniel Hawthorne<\/li>/)
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
          expect(rendered).toMatch(/<li>Edgar Allen Poe<\/li>/)
          expect(rendered).toMatch(/<li>Mark Twain<\/li>/)
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
              }
            }
          });

          subview = new SubLister();
          rendered = subview.$.html();
        });

        it("renders correctly", function () {
          expect(rendered).toMatch(/<h1>America! It's Authors!<\/h1>/);
          expect(rendered).toMatch(/<li>Edgar Allen Poe<\/li>/)
          expect(rendered).toMatch(/<li>Mark Twain<\/li>/)
          expect(rendered).toMatch(/<li>Herman Melville<\/li>/)
          expect(rendered).toMatch(/<li>Nathaniel Hawthorne<\/li>/)
        });
      })
    });

    describe('assemble class method', function() {
      var ListItem;

      beforeEach(function(){
        ListItem = jlisten.View.subclass({},{
          template: function() {
            return "<li class='list_item'>{{first_name}} {{last_name}}</li>"
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
          var item = list[0];
          expect(item.$.is('li.list_item')).toBe(true);
          expect(item.$.text()).toBe("Herman Melville");

          item = list[1];
          expect(item.$.is('li.list_item')).toBe(true);
          expect(item.$.text()).toBe("Nathaniel Hawthorne");
        });
      });
    });
  });
});
