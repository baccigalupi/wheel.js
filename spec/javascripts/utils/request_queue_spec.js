describe('Wheel.Utils.RequestQueue', function() {
  var app, queue, opts, context;
  beforeEach(function() {
    app = {};

    context = {
      _uid: 42
    };

    opts = {
      url: '/foo/u',
      context: context,
      data: {bar: 'zardoz'},
      method: 'put',
      foo: 'bar'
    };
  });

  describe('initialize', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
    });

    it('stores a reference to the app', function() {
      expect(queue.app).toBe(app);
    });

    it('sets the request count to 0', function() {
      expect(queue.requestCount).toBe(0);
    });

    it('has a requests array', function() {
      expect(queue.requests).toEqual([]);
    });

    it('has a contexts array', function() {
      expect(queue.contexts).toEqual([]);
    });
  });

  describe('add(opts)', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
      queue.requests = [];

      spyOn(queue, 'send');
      queue.add(opts);
    });

    it('adds the request opts to the requests', function() {
      expect(queue.requests).toEqual([opts]);
    });

    it('calls "send"', function() {
      expect(queue.send).toHaveBeenCalled();
    });

    it('puts new requests at the end of the array', function() {
      var last = {url: '/foo/us', context: {_uid: 66}};
      queue.add(last);
      expect(queue.requests.shift()).toBe(last);
    });
  });

  describe('send()', function() {
    beforeEach(function() {
      spyOn($, 'ajax');
      queue.requests = [opts];
    });

    it('does nothing if the number of requests is >= the limit', function() {
      queue.requestCount = Wheel.Utils.RequestQueue.connectionLimit();
      queue.send();
      expect($.ajax).not.toHaveBeenCalled();
    });

    it('does nothing if there are no requests', function() {
      queue.requests = [];
      queue.requestCount = 0;
      queue.send();
      expect($.ajax).not.toHaveBeenCalled();
    });

    describe('context already in use', function() {
      // figure this one out!
    });

    describe('sends the request', function() {
      var requestOpts;
      beforeEach(function() {
        queue.requestCount = 0;
        queue.contexts = [];
      });

      it('will increment the requestCount', function() {
        queue.send();
        expect(queue.requestCount).toBe(1);
      });

      describe('contexts', function() {
        it('adds the context uid to the array', function() {
          queue.send();
          expect(queue.contexts).toEqual([42])
        });

        it('doesn\'t add anything if the context does not exist', function() {
          opts.context = {};
          queue.requests = [opts];
          queue.send();
          expect(queue.contexts).toEqual([]);
        });

        it('doesn\'t add anything if there is not context', function() {
          delete opts.context;
          queue.requests = [opts];
          queue.send();
          expect(queue.contexts).toEqual([]);
        });
      });

      describe('basic attributes', function() {
        beforeEach(function() {
          queue.send();
          requestOpts = $.ajax.mostRecentCall.args[0];
        });

        it('via the $.ajax method', function() {
          expect($.ajax).toHaveBeenCalled();
        });

        it('to the right url', function() {
          expect(requestOpts.url).toBe('/foo/u');
        });

        it('passes on any other miscelaneous stuff', function() {
          expect(requestOpts.foo).toBe('bar');
        });
      });

      describe('callbacks', function() {
        var response;
        beforeEach(function() {
          response = 'response';
          queue.send();
          requestOpts = $.ajax.mostRecentCall.args[0];
        });

        it('onSuccess is called from a closure', function() {
          spyOn(queue, 'onSuccess');
          requestOpts.success(response);
          expect(queue.onSuccess).toHaveBeenCalledWith(response, opts);
        });

        it('onError is called from a closure', function() {
          spyOn(queue, 'onError');
          requestOpts.error(response);
          expect(queue.onError).toHaveBeenCalledWith(response, opts);
        });

        it('onComplete is called from a closure', function() {
          spyOn(queue, 'onComplete');
          requestOpts.complete(response);
          expect(queue.onComplete).toHaveBeenCalledWith(response, opts);
        });
      });

      describe('http method', function() {
        var send = function() {
          queue.requests = [opts];
          queue.send();
          requestOpts = $.ajax.mostRecentCall.args[0];
        };

        it('works with get', function() {
          opts.type = 'get';
          send();
          expect(requestOpts.type).toBe('get');
        });

        it('works with post', function() {
          opts.type = 'post';
          send();
          expect(requestOpts.type).toBe('post');
        });

        describe('put', function() {
          beforeEach(function() {
            opts.type = 'put';
            send();
          });

          it('changes the type to post', function() {
            expect(requestOpts.type).toBe('post');
          });

          it('adds a _method param to the data', function() {
            expect(requestOpts.data._method).toBe('put');
          });
        });

        describe('delete', function() {
          beforeEach(function() {
            opts.type = 'delete';
            send();
          });

          it('changes the type to post', function() {
            expect(requestOpts.type).toBe('post');
          });

          it('adds a _method param to the data', function() {
            expect(requestOpts.data._method).toBe('delete');
          });
        });
      });
    });
  });

  xdescribe('callbacks', function() {
    describe('onSucces(response, requestOpts)', function() {
      it('if the success function exists it is called', function() {
        
      });

      it('if the succes function does not exist all is good', function() {
        
      });
    });

    describe('onFailure(response, requestOpts)', function() {
      it('if the success function exists it is called', function() {
        
      });

      it('if the succes function does not exist all is good', function() {
        
      });
    });

    describe('onComplete(response, requestOpts)', function() {
      it('if the success function exists it is called', function() {
        
      });

      it('if the succes function does not exist all is good', function() {
        
      });
      
      it('triggers a "next" event', function() {
        
      });

      it('decrements the requestCount', function() {
        
      });
    });
  });

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

  it('it is a singleton', function() {
    expect(Wheel.Utils.RequestQueue.create() instanceof Wheel.Class.Singleton).toBe(true);
    Wheel.Utils.RequestQueue.singleton = null;
  });
});
