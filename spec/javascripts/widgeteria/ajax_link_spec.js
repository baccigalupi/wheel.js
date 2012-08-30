describe("Wheel.Widgeteria.AjaxLink", function () {
  var Linker, link;

  beforeEach(function() {
    Linker = Wheel.Widgeteria.AjaxLink.subclass({},{
      template: function() {
        return "<a class='click' href='http://clinkity.com'>Clink</a>"
      }
    });
    link = new Linker();
  });

  it("has the right class heirarchy", function() {
    expect(link instanceof Wheel.Widgeteria.Link).toBe(true);
    expect(link instanceof Wheel.Widgeteria.AjaxLink).toBe(true);
  });

  describe("onClick", function () {
    var args, spy, data;
    beforeEach(function() {
      spy = spyOn(link, 'send');
      link.onClick();
    });

    it("calls Ajax.send", function () {
      expect(link.send).toHaveBeenCalled();
    });
  });
});
