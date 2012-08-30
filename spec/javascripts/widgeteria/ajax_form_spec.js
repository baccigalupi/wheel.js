describe('Wheel.Widgeteria.AjaxForm', function() {
  var Former, form;

  beforeEach(function() {
    Former = Wheel.Widgeteria.AjaxForm.subclass({},{
      template: function() {
        return "" +
        "<form action='http://conformity.com'>" +
        "  <input type='hidden' name='fit_in' value='true'/>" +
        "  <input type='submit' value='Conform'/>" +
        "</form>"
      }
    });
    form = new Former();
  });

  it("has the right class heirarchy", function() {
    expect(form instanceof Wheel.Widgeteria.Form).toBe(true);
    expect(form instanceof Wheel.Widgeteria.AjaxForm).toBe(true);
  });

  describe("onSubmit", function () {
    var args, spy, data;
    beforeEach(function() {
      spy = spyOn(form, 'send');
      form.onSubmit();
    });

    it("calls Ajax.send", function () {
      expect(form.send).toHaveBeenCalled();
    });
  });
});
