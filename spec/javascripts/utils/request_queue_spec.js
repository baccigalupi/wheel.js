describe('Wheel.Utils.RequestQueue', function() {
  var app, queue, opts, context;
  beforeEach(function() {
    Wheel.Utils.RequestQueue.singleton = undefined;
    Wheel.Utils.RequestQueue._connectionLimit = 2;
    app = {
      connected: jasmine.createSpy().andReturn(true),
      checkConnection: jasmine.createSpy(),
      on: jasmine.createSpy(),
      off: jasmine.createSpy()
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

  it('it is a singleton', function() {
    expect(Wheel.Utils.RequestQueue.create({app: app}) instanceof Wheel.Class.Singleton).toBe(true);
    Wheel.Utils.RequestQueue.singleton = null;
  });

  describe('initialize', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
    });

    it('stores a reference to the app', function() {
      expect(queue.app).toBe(app);
    });

    it('sets the request count to 0', function() {
      expect(queue._requestCount).toBe(0);
    });

    it('has a requests array', function() {
      expect(queue._requests).toEqual([]);
    });

    it('has a contexts array', function() {
      expect(queue._contexts).toEqual([]);
    });

    it('has the state "online"', function() {
      expect(queue._state).toBe("online");
    });

    it('listens for offline events on app and calls "offline"', function() {
      expect(queue.app.on).toHaveBeenCalledWith('offline', queue.offline, queue);
    });
  });

  describe('offline()', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
      queue.offline();
    });

    it('changes state', function() {
      expect(queue._state).toBe('offline');
    });

    it('listens for app online events, and calls "restart"', function() {
      expect(queue.app.on).toHaveBeenCalledWith('online', queue.restart, queue)
    });
  });

  describe('restart()', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
      spyOn(window, 'setTimeout');
      queue.restart();
    });

    it('stops listening on application online', function() {
      expect(queue.app.off).toHaveBeenCalledWith('online', queue.restart)
    });

    it('changes the state to "restarting"', function() {
      expect(queue._state).toBe("restarting");
    });

    it('waits 5 seconds and calls _reset', function() {
      spyOn(queue, '_reset');
      expect(window.setTimeout).toHaveBeenCalled();
      var args = window.setTimeout.mostRecentCall.args;
      expect(args[1]).toBe(5000);
      args[0]();
      expect(queue._reset).toHaveBeenCalled();
    });
  });

  describe('resetting', function() {
    beforeEach(function() {
      opts._inProgress = true;
      queue = Wheel.Utils.RequestQueue.create({app: app});
      queue._requestCount = 2;
      queue._contexts = {42: true};
      queue._requests = [opts];
    });

    describe('state is not "starting"', function() {
      beforeEach(function() {
        queue._reset();
      });

      it('does not clear the context', function() {
        expect(queue._contexts).toEqual({42: true});
      });

      it('does not reset requests that are in progress', function() {
        expect(queue._requests[0]._inProgress).toBe(true);
      });

      it('does not reset the request count', function() {
        expect(queue._requestCount).toBe(2);
      });
    });


    describe('state is "restarting"', function() {
      beforeEach(function() {
        spyOn(queue, 'start');
        queue._state = 'restarting';
        queue._reset();
      });

      it('clears the contexts', function() {
        expect(queue._contexts).toEqual({});
      });

      it('resets the requests to not be in progress', function() {
        expect(queue._requests[0]._inProgress).toBe(false);
      });

      it('resets the request count', function() {
        expect(queue._requestCount).toBe(0);
      });

      it('calls start', function() {
        expect(queue.start).toHaveBeenCalled();
      });
    });
  });

  describe('add(opts)', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
      queue._requests = [];

      spyOn(queue, 'start');
      queue.add(opts);
    });

    it('adds the request opts to the requests', function() {
      expect(queue._requests).toEqual([opts]);
    });

    it('calls "start"', function() {
      expect(queue.start).toHaveBeenCalled();
    });

    it('puts new requests at the end of the array', function() {
      var last = {url: '/foo/us', context: {_uid: 66}};
      queue.add(last);
      expect(queue._requests[1]).toBe(last);
    });
  });

  describe('start()', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
      queue._requests = [opts];
      queue._contexts = [];
      spyOn(queue, 'send');
    });

    describe('nothing is sent', function() {
      beforeEach(function() {
        queue.app.connected.andReturn(true);
        queue._requestCount = 0;
      });

      it('if the state is not "online"', function() {
        queue._state = 'foobar';
        queue.start();
        expect(queue.send).not.toHaveBeenCalled();
      });

      it('if the application is offline', function() {
        queue.app.connected.andReturn(false);
        queue.start();
        expect(queue.send).not.toHaveBeenCalled();
      });

      it('if the number of requests is >= the limit', function() {
        queue._requestCount = Wheel.Utils.RequestQueue.connectionLimit();
        queue.start();
        expect(queue.send).not.toHaveBeenCalled();
      });

      it('if there are no requests', function() {
        queue._requests = [];
        queue.start();
        expect(queue.send).not.toHaveBeenCalled();
      });
    });

    describe('send is called', function() {
      beforeEach(function() {
        queue._contexts = [];
        queue._requestCount = 0;
      });

      it('if conditions are met', function() {
        queue.start();
        expect(queue.send).toHaveBeenCalledWith(opts);
      });

      it('marks the request as in progress', function() {
        queue.start();
        expect(queue._requests[0]._inProgress).toBe(true);
      });

      it('will increment the requestCount', function() {
        queue.start();
        expect(queue._requestCount).toBe(1);
      });

      it('will add the context to the list', function() {
        queue.start();
        expect(queue._contexts[42]).toBe(true);
      });

      it('will call send repeatedly until request limit is reached', function() {
        Wheel.Utils.RequestQueue._connectionLimit = 2;
        queue._requests = [opts,
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
        queue._contexts = [];
        queue._requestCount = 0;
      });

      it('if request context is already in use', function() {
        queue._contexts = {42: true};
        queue.start();
        expect(queue.send).not.toHaveBeenCalled();
      });

      it('if the request is marked as in progress', function() {
        queue._requests[0]._inProgress = true;
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
        queue._requestCount = 0;
        queue._contexts = {};
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

        it('is not sent with a context', function() {
          expect(requestOpts.context).toBe(undefined);
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

  describe('callbacks', function() {
    beforeEach(function() {
      queue = Wheel.Utils.RequestQueue.create({app: app});
    });

    describe('onSucces(response, requestOpts)', function() {
      beforeEach(function() {
        queue._contexts = {42: true};
        queue._requests = [opts];
      });

      describe('calling the success function', function() {
        it('it calls it with the response', function() {
          opts.success = jasmine.createSpy();
          queue.onSuccess('response', opts);
          expect(opts.success).toHaveBeenCalledWith('response');
        });

        it('calls it without a context', function() {
          opts.success = function() {
            this.changedYa = true;
          };
          delete opts.context;
          queue.onSuccess('response', opts);
          expect(opts.changedYa).toBe(true);
          expect(context.changedYa).toBe(undefined);
        });

        it('calls it with the right context', function() {
          opts.success = function() {
            this.changedYa = true;
          };
          queue.onSuccess('response', opts);
          expect(opts.changedYa).toBe(undefined);
          expect(context.changedYa).toBe(true);
        });
      });

      it('if the succes function does not exist all is good', function() {
        queue.onSuccess('response', opts);
        // no errors, then its all good
      });

      it('removes the context from the list', function() {
        queue.onSuccess('response', opts);
        expect(queue._contexts).toEqual({});
      });

      it('removes the request from the list', function() {
        queue.onSuccess('response', opts);
        expect(queue._requests).toEqual([]);
      });
    });

    describe('onError(response, requestOpts)', function() {
      beforeEach(function() {
        queue._requests = [opts];
        queue._contexts = {42: true};
      });

      it('tests to see if the app is offline', function() {
        queue.onError('response', opts);
        expect(queue.app.checkConnection).toHaveBeenCalled();
      });

      describe('if offline', function() {
        beforeEach(function() {
          opts.error = jasmine.createSpy();
          queue.app.connected.andReturn(false);
          queue.onError('response', opts);
        });

        it('does not call the callback', function() {
          expect(opts.error).not.toHaveBeenCalled();
        });

        it('does not remove the context', function() {
          expect(queue._contexts).toEqual({42: true});
        });

        it('does not remove the request', function() {
          expect(queue._requests).toEqual([opts]);
        });
      });

      describe('if online', function() {
        beforeEach(function() {
          opts.error = jasmine.createSpy();
          queue.app.connected.andReturn(true);
          queue.onError('response', opts);
        });

        it('if the callback function exists it is called', function() {
          expect(opts.error).toHaveBeenCalledWith('response');
        });

        it('removes the context', function() {
          expect(queue._contexts).toEqual({});
        });

        it('removes the request', function() {
          expect(queue._requests).toEqual([]);
        });
      })
    });

    describe('onComplete(response, requestOpts)', function() {
      beforeEach(function() {
        queue._requestCount = 2;
        spyOn(queue, 'start');
      });

      it('if the callback function exists it is called', function() {
        opts.complete = jasmine.createSpy();
        queue.onComplete('response', opts);
        expect(opts.complete).toHaveBeenCalledWith('response');
      });

      it('calls start', function() {
        queue.onComplete('response', opts);
        expect(queue.start).toHaveBeenCalled();
      });

      it('decrements the requestCount', function() {
        queue.onComplete('response', opts);
        expect(queue._requestCount).toBe(1);
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
});
