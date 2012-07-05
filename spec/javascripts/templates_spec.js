describe('Wheel.Templates', function() {
  var templates;
  beforeEach(function() {
    Wheel.Templates.singleton = null;
    templates = Wheel.Templates.build();
  });

  it('is a singleton', function() {
    expect(templates instanceof Wheel.Class.Singleton).toBeTruthy();
  });

  describe('initialization', function() {
    beforeEach(function() {
      hash = {
        'Something.Tasks': '<ul class="tasks"></ul>',
        'Something.Task': '<li class="task">{{name}}</li>'
      };
      Wheel.Templates.singleton = null;
      templates = Wheel.Templates.build(hash);
    });

    it('will append what is passed as an argument', function() {
      expect(templates.Something.Tasks).toBe(hash['Something.Tasks']);
      expect(templates.Something.Task).toBe(hash['Something.Task']);
    });
  });

  describe('appending a hash of values', function() {
    var hash;
    beforeEach(function() {
      hash = {
        'Whatever.Tasks': '<ul class="tasks"></ul>',
        'Whatever.Task': '<li class="task">{{name}}</li>'
      };
      templates.append(hash);
    });

    it('adds the namespace', function() {
      expect(typeof templates.Whatever).toBe('object');
    });

    it('adds the templates', function() {
      expect(templates.Whatever.Tasks).toBe(hash['Whatever.Tasks']);
      expect(templates.Whatever.Task).toBe(hash['Whatever.Task']);
    });
  });

  describe('gathering from dom script tags', function() {
    var temps;
    beforeEach(function() {
      temps = [
        $("<script type='text/html' class='template' name='Foo.Bar'><div>foo &amp; bar</div></script>"),
        $("<script type='text/html' class='template' name='Baz'><ul><li>baz</li></ul></script>")
      ];

      $.each(temps, function(i, template) {
        $('body').append(template);
      });

      templates.gather();
    });

    afterEach(function() {
      $.each(temps, function(i, e) {
        $(e).remove();
      });
    });

    it('stores templates via key according to the name attribute', function() {
      expect(templates.Baz).not.toBeFalsy();
      expect(templates.Foo.Bar).not.toBeFalsy();
    });

    it('stores the template as html', function() {
      expect(templates.Baz).toBe("<ul><li>baz</li></ul>");
    });
  });

  describe('requesting them from the server', function() {
    var response;
    beforeEach(function() {
      response = {
        'MyApp.Tasks': '<ul class="tasks"></ul>',
        'MyApp.Task': '<li class="task">{{name}}</li>'
      };
      spyOn($, 'ajax').andReturn(response);

      templates.retrieve();
    });

    describe('the request', function() {
      var opts;
      beforeEach(function() {
        opts = $.ajax.mostRecentCall.args[0];
      });

      it('sends to a default url if no url is provided', function() {
        expect($.ajax).toHaveBeenCalled();
        expect(opts.url).toBe('/templates');
      });

      it('sends to the url provided as an arguments', function() {
        templates.retrieve('/js_templates');
        opts = $.ajax.mostRecentCall.args[0];
        expect(opts.url).toBe('/js_templates');
      });

      it('the success method is "append"', function() {
        spyOn(templates, 'append');
        opts.success(response);
        expect(templates.append).toHaveBeenCalledWith(response);
      });
    });

    describe('processing the response', function() {
      beforeEach(function() {
        $.ajax.mostRecentCall.args[0].success(response);
      });

      it('correctly builds the namespace', function() {
        expect(templates.MyApp).toBeTruthy();
      });

      it('sets the value to the right templates', function() {
        expect(templates.MyApp.Tasks).toBe(response['MyApp.Tasks']);
      });
    });
  });
});
