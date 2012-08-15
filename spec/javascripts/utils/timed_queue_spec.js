describe('Wheel.Utils.TimedQueue', function() {
  var queue;
  beforeEach(function() {
    queue = Wheel.Utils.TimedQueue.build();
  });

  describe('configuration', function() {
    it('has a default pause of 500', function() {
      expect(queue.defaultWait).toBe(500);
    });

    it('default time can be customized', function() {
      queue = Wheel.Utils.TimedQueue.build({defaultWait: 1000});
      expect(queue.defaultWait).toBe(1000);
    });
  });

  describe('#init', function() {
    it('creates a set of empty steps', function() {
      expect(queue.steps).toEqual({});
    });
  });

  describe('#add', function() {
    var first, second;
    beforeEach(function() {
      first = function() {
        return 'first';
      };

      second = function() {
        return 'second';
      };

      queue.add(first);
      queue.add(second, 0);
    });

    it('appends a function on to the end of the steps list', function() {
      expect(queue.steps[0].step).toBe(first);
      expect(queue.steps[1].step).toBe(second);
    });

    it('list element has the default wait time if none is passed in', function() {
      expect(queue.steps[0].wait).toBe(queue.defaultWait);
    });

    it('takes an alternative time', function() {
      expect(queue.steps[1].wait).toBe(0);
    });
  });

  describe('#wait', function() {
    beforeEach(function() {
      queue.wait();
    });

    it('inserts an empty function into the queue', function() {
      expect(queue.steps[0].step).toBe(queue._stub);
    });

    it('uses the default wait time', function() {
      expect(queue.steps[0].wait).toBe(queue.defaultWait);
    });

    it('wait time can be passed in', function() {
      queue.wait(1000);
      expect(queue.steps[1].wait).toBe(1000);
    });
  });

  describe('#run', function() {
    var things;

    beforeEach(function() {
      things = [];
    });

    it('performs all the step serially', function() {
      queue.add(function() {
        things.push('one');
      }, 0);

      queue.add(function() {
        things.push('two');
      }, 0);

      queue.add(function() {
        things.push('three');
      }, 0);

      queue.run();
      waits(10);
      runs(function() {
        expect(things).toEqual(['one', 'two', 'three']);
      });
    });

    it('pauses for the right amount of time between steps', function() {
      queue.add(function() {
        things.push('one');
      }, 100);

      queue.add(function() {
        things.push('two');
      }, 200);

      queue.add(function() {
        things.push('three');
      }, 300);

      queue.run();

      expect(things).toEqual([]);

      waits(110);
      runs(function() {
        expect(things).toEqual(['one']);
      });

      waits(210);
      runs(function() {
        expect(things).toEqual(['one', 'two']);
      });

      waits(310);
      runs(function() {
        expect(things).toEqual(['one', 'two', 'three']);
      });
    });

    it('resets the steps to empty', function() {
      queue.add(function() {
        things.push('one');
      }, 0);

      queue.run();
      expect(queue.steps.length).toBe(0);
    });
  });
});
