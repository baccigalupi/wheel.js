describe('Shimming Zepto as needed', function() {
  describe('detatch vs. remove, going with jQuery', function() {
    var $fixture, $shimmers, clicked;
    beforeEach(function() {
      clicked = 0;
      $fixture = $('<ul class="fixture"></ul>');
      $.each([1,2,3,4], function(i) {
        $fixture.append("<li class='list_shimmer'>shimmer me "+i+"</li>");
      });

      $shimmer = $("li.list_shimmer");

      $shimmer.on('click', function (){
        clicked ++;
      });
    });

    afterEach(function() {
      $fixture.parent().empty();
    });

    describe('#remove', function() {
      beforeEach(function() {
        $shimmer.remove();
      });

      it('removes the elements from the dom', function() {
        expect($fixture.find('li').length).toBe(0);
      });

      it('clears listeners', function() {
        $shimmer.trigger('click');
        expect(clicked).toBe(0);
      });
    });

    describe('#detatch', function() {
      beforeEach(function() {
        $shimmer.detatch();
      });

      it('removes the elements from the dom', function() {
        expect($fixture.find('li').length).toBe(0);
      });

      it('continues to listen on elements', function() {
        $shimmer.trigger('click');
        expect(clicked).toBe(4);
      });
    });
  });
});
