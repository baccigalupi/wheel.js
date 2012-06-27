describe('Wheel.Templates', function() {
  describe('gathering from dom script tags', function() {
    var templates;
    beforeEach(function() {
      templates = [
        $("<script type='text/html' class='template' name='Foo.Bar'><div>foo &amp; bar</div></script>"),
        $("<script type='text/html' class='template' name='Baz'><ul><li>baz</li></ul></script>")
      ];

      $.each(templates, function(i, template) {
        $('body').append(template);
      });

      Wheel.Templates.gather();
    });

    afterEach(function() {
      $.each(templates, function(i, e) {
        $(e).remove();
      });
    });

    it('stores templates via key according to the name attribute', function() {
      expect(Wheel.Templates.Baz).not.toBeFalsy();
      expect(Wheel.Templates.Foo.Bar).not.toBeFalsy();
    });

    it('stores the template as html', function() {
      expect(Wheel.Templates.Baz).toBe("<ul><li>baz</li></ul>");
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

      Wheel.Templates.retrieve();
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
        Wheel.Templates.retrieve('/js_templates');
        opts = $.ajax.mostRecentCall.args[0];
        expect(opts.url).toBe('/js_templates');
      });

      it('the success method is "onSuccess"', function() {
        spyOn(Wheel.Templates, 'onSuccess');
        opts.success(response);
        expect(Wheel.Templates.onSuccess).toHaveBeenCalledWith(response);
      });
    });

    describe('processing the response', function() {
      beforeEach(function() {
        $.ajax.mostRecentCall.args[0].success(response);
      });

      it('correctly builds the namespace', function() {
        expect(Wheel.Templates.MyApp).toBeTruthy();
      });

      it('sets the value to the right templates', function() {
        expect(Wheel.Templates.MyApp.Tasks).toBe(response['MyApp.Tasks']);
      });
    });
  });
});
