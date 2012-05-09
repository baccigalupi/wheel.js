/*
 * it saves all the requests to localStorage
 * it clears them from storage when successful
 * it holds a class level contstant for number of connections, defaults to 2
 * instance stores number of connections open
 * on failed request, it checks to see if there is a connection
 * it stops the queue when the application is offline
 * it starts the queue when the application is online
 */
describe('Wheel.Utils.RequestQueue', function() {
  describe('class level limit on simultaneous connections', function() {
    beforeEach(function() {
      spyOn(Wheel.Utils.Loader, 'canZepto').andReturn(true);
    });

    it('is 6 for browsers that can zepto', function() {
      Wheel.Utils.RequestQueue._connectionLimit = null;
      expect(Wheel.Utils.RequestQueue.connectionLimit()).toBe(6);
    });

    it('is 2 for browsers that cannot zepto', function() {
      Wheel.Utils.Loader.canZepto.andReturn(false);
      Wheel.Utils.RequestQueue._connectionLimit = null;
      expect(Wheel.Utils.RequestQueue.connectionLimit()).toBe(2);
    });


    it('memoizes the result', function() {
      Wheel.Utils.RequestQueue._connectionLimit = 12;
      expect(Wheel.Utils.RequestQueue.connectionLimit()).toBe(12);
    });
  });

  describe('it is a singleton', function() {
    var queue;
    beforeEach(function() {
      Wheel.Utils.RequestQueue.singleton = null;
      queue = new Wheel.Utils.RequestQueue();
    });

    it('stores itself on the class', function() {
      expect(Wheel.Utils.RequestQueue.singleton).toBe(queue);
    });

    describe('when an instance already exists', function() {
      it('will not change the class level singleton', function() {
        new Wheel.Utils.RequestQueue();
        expect(Wheel.Utils.RequestQueue.singleton).toBe(queue);
      });

      it('will not call init', function() {
        spyOn(Wheel.Utils.RequestQueue.prototype, 'init');
        expect(Wheel.Utils.RequestQueue.prototype.init).not.toHaveBeenCalled();
      });

      it('helper method .create will return the original instance', function() {
        expect(Wheel.Utils.RequestQueue.create()).toBe(queue);
      });
    });
  });
});
