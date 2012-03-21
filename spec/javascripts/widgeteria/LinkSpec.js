describe('jlisten.widgets.Link', function() {
  var link, Linker, html;

  beforeEach(function() {
    html =
    "<div class='something_big'>" +
    "  <ul>" +
    "    <li>" +
    "      <a class='clunker' href='http://clunkerfoo.com'>Clunk on Dude!</a>" +
    "    </li>" +
    "  </ul>" +
    "</div>";

    Linker = jlisten.widgets.Link.subclass({
    }, {
      cssSelector: 'a.clunker'
    });

    linker = Linker.gather(html)[0];
  });

  describe("init()", function() {
    it("sets the this.url", function () {
      expect(linker.url).toBe('http://clunkerfoo.com');
    });

    describe("this.propogate", function() {
      it("is true by default", function () {
        expect(linker.propogate).toBeTruthy();
      });

      it("can be overwritten by initialization variables", function () {
        linker = new Linker($(html).find('a'), {propogate: false});
        expect(linker.propogate).toBe(false);
      });
    });
  });

  describe("listen()", function() {
    it("binds onClick to click events", function() {
      spyOn(linker, 'onClick');
      linker.$.trigger('click');
      expect(linker.onClick).toHaveBeenCalled();
    });

    it("prevents the default click behavior");

    describe("propegation", function() {
      it("prevents propegation if this.propegate is false");
      it("otherwise allows the propegation of the event");
    });

    describe("when the dom has a disabled attribute", function (){
      it("does not bind to onClick");
    });
  });
});
