describe('Wheel.Utils.RequestQueue', function() {
  var app, queue, opts, context;
  beforeEach(function() {
    app = {
      connected: jasmine.createSpy().andReturn(true)
    };

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

    spyOn($, 'ajax');
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

      spyOn(queue, 'start');
      queue.add(opts);
    });

    it('adds the request opts to the requests', function() {
      expect(queue.requests).toEqual([opts]);
    });

    it('calls "start"', function() {
      expect(queue.start).toHaveBeenCalled();
    });

    it('puts new requests at the end of the array', function() {
      var last = {url: '/foo/us', context: {_uid: 66}};
      queue.add(last);
      expect(queue.requests[1]).toBe(last);
    });
  });

  describe('start()', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
      queue.requests = [opts];
      queue.contexts = [];
      spyOn(queue, 'send');
    });

    describe('nothing is sent', function() {
      beforeEach(function() {
        queue.app.connected.andReturn(true);
        queue.requestCount = 0;
      });

      it('if the application is offline', function() {
        queue.app.connected.andReturn(false);
        queue.start();
        expect(queue.send).not.toHaveBeenCalled();
      });

      it('if the number of requests is >= the limit', function() {
        queue.requestCount = Wheel.Utils.RequestQueue.connectionLimit();
        queue.start();
        expect(queue.send).not.toHaveBeenCalled();
      });

      it('if there are no requests', function() {
        queue.requests = [];
        queue.start();
        expect(queue.send).not.toHaveBeenCalled();
      });
    });

    describe('send is called', function() {
      beforeEach(function() {
        queue.contexts = [];
        queue.requestCount = 0;
      });

      it('if conditions are met', function() {
        queue.start();
        expect(queue.send).toHaveBeenCalledWith(opts);
      });

      it('marks the request as in progress', function() {
        queue.start();
        expect(queue.requests[0]._inProgress).toBe(true);
      });

      it('will increment the requestCount', function() {
        queue.start();
        expect(queue.requestCount).toBe(1);
      });

      it('will add the context to the list', function() {
        queue.start();
        expect(queue.contexts[42]).toBe(true);
      });

      it('will call send repeatedly until request limit is reached', function() {
        Wheel.Utils.RequestQueue._connectionLimit = 2;
        queue.requests = [opts,
          {url: '/go/foo'},
          {url: '/not/going/nowhere'}
        ]
        queue.start();
        expect(queue.send.argsForCall.length).toBe(2);
        expect(queue.send.argsForCall[0][0].url).toEqual(opts.url);
        expect(queue.send.argsForCall[1][0].url).toEqual('/go/foo');
      });
    });

    describe('requests will be skipped if', function() {
      beforeEach(function() {
        queue.contexts = [];
        queue.requestCount = 0;
      });

      it('if request context is already in use', function() {
        queue.contexts = {42: true};
        queue.start();
        expect(queue.send).not.toHaveBeenCalled();
      });

      it('if the request is marked as in progress', function() {
        queue.requests[0]._inProgress = true;
        queue.start()
        expect(queue.send).not.toHaveBeenCalled();
      });
    });
  });

  describe('send()', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
    });

    describe('sends the request', function() {
      var requestOpts;
      beforeEach(function() {
        queue.requestCount = 0;
        queue.contexts = {};
      });

      describe('basic attributes', function() {
        beforeEach(function() {
          queue.send(opts);
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
          queue.send(opts);
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
          queue.send(opts);
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
