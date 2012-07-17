describe('Wheel.Widgeteria.Link', function() {
  var link, Linker, dom;

  beforeEach(function() {
    dom ="<a class='clunker' href='http://clunkerfoo.com'>Clunk on Dude!</a>";

    Linker = Wheel.Widgeteria.Link.subclass({
    }, {
      selector: 'a.clunker'
    });

    linker = Linker.build(dom);
  });

  describe("init()", function() {
    it("sets the this.url", function () {
      expect(linker.url).toBe('http://clunkerfoo.com');
    });

    describe("this.propagate", function() {
      it("is true by default", function () {
        expect(linker.propagate).toBeTruthy();
      });

      it("can be overwritten by initialization variables", function () {
        linker = new Linker($(dom).find('a'), {propagate: false});
        expect(linker.propagate).toBe(false);
      });
    });

    describe("disabled", function () {
      it("defaults to undefined", function (){
        expect(linker.disabled).toBe(undefined);
      });

      it("will be true if it finds a disabled attribute", function () {
        linker = new Linker($(dom).attr('disabled', true));
        expect(linker.disabled).toBe(true);
      });

      it("will consider the initialization options before the default or dom attribute", function () {
        linker = new Linker($(dom).attr('disabled', true), {disabled: false});
        expect(linker.disabled).toBe(false);
      });
    });
  });

  describe("listen()", function() {
    var event;
    beforeEach(function() {
      event = $.Event("click");
    });

    it("binds onClick to click events", function() {
      spyOn(linker, 'onClick');
      linker.$.trigger('click');
      expect(linker.onClick).toHaveBeenCalled();
    });

    it("prevents the default click behavior", function() {
      spyOn(event, 'preventDefault').andCallThrough();
      linker.$.trigger(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    describe("propegation", function() {
       it("allows the propegation the click event by default", function() {
        spyOn(event, 'stopPropagation');
        linker.$.trigger(event);
        expect(event.stopPropagation).not.toHaveBeenCalled();
      });

      it("prevents propegation if this.propegate is false", function() {
        spyOn(event, 'stopPropagation');
        linker.propagate = false;
        linker.$.trigger(event);
        expect(event.stopPropagation).toHaveBeenCalled();
      });
    });

    describe("when has an attribute disabled that is truthy", function (){
      beforeEach(function() {
        linker.disabled = true;
      });

      it("will not call onClick", function () {
        spyOn(linker, 'onClick');
        linker.$.trigger(event);
        expect(linker.onClick).not.toHaveBeenCalled();
      });

      it("will cancel the default", function () {
        spyOn(event, 'preventDefault').andCallThrough();
        linker.$.trigger(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it("will stop propagation when specified", function () {
        linker.propagate = false;
        spyOn(event, 'stopPropagation');
        linker.$.trigger(event);
        expect(event.stopPropagation).toHaveBeenCalled();
      });
    });
  });
});
