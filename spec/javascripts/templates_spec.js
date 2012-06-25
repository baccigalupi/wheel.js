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
});
