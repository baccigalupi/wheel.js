describe('Wheel.Model', function() {
  var task, Task;
  beforeEach(function() {
    Task = Wheel.Model.subclass({
      properties: ['name', 'due_at', 'state']
    });
  });

  describe('state', function() {
    describe('isNew', function() {
      it('is false if the object has an id', function() {
        task = Task.create();
        expect(task.isNew()).toBe(false);
      });

      it('is true if the object has an id', function() {
        task = Task.create({id: 1});
        expect(task.isNew()).toBe(true);
      });
    });

    xdescribe('isChanged', function() {
      it('', function() {
        
      });
    });
  });

  xdescribe('properties', function() {
    beforeEach(function() {
      task = Task.create({
        name: 'Do some meta',
        state: 0,
        due_at: null
      });
    });

    it('builds a reader for the attribute', function() {
      expect(task.name()).toBe('Do some meta');
    });
  });

  describe('attrAccessor(propName)', function() {
    beforeEach(function() {
      task = Task.create({
        name: 'Do some meta',
        state: 0,
        due_at: null
      });

      task.attrAccessor('owner');
    });

    it('creates a prototype function with that name', function() {
      expect(typeof Task.prototype.owner == 'function').toBe(true)
    });
  });


  xdescribe('save', function() {
    describe('object has not been saved', function() {
      it('sends a post request', function() {
        
      });
    });
  });
});
