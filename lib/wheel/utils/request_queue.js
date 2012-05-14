Wheel.Utils.RequestQueue = Wheel.Class.Singleton.subclass({
  init: function() {
    this._requestCount = 0;
    this._requests = [];
    this._contexts = {};
  },

  add: function(requestOpts) {
    this._requests.push(requestOpts);
    this.start();
  },

  _inContext: function(context) {
    return !!(context && context._uid && this._contexts[context._uid]);
  },

  start: function(index) {
    index = index || 0;
    var opts = this._requests[index];
    if ( opts && this.app.connected() && this._requestCount < this._class.connectionLimit() ) {
      var context =  opts.context && opts.context._uid;
      if ( !opts._inProgress && !this._inContext(opts.context) ) {
        this.send(opts);
        this._requests[index]._inProgress = true;
        context && (this._contexts[context] = true);
        this._requestCount ++;
      }
      this.start(index + 1);
    }
  },

  send: function(originalOpts) {
    var self = this;
    var opts = $.extend({}, originalOpts);
    opts.success = function(response) {
      self.onSuccess(response, originalOpts);
    };
    opts.complete = function(response) {
      self.onComplete(response, originalOpts);
    };
    opts.error = function(response) {
      self.onError(response, originalOpts);
    };

    var type = (opts.httpMethod || opts.type || 'get').toLowerCase();
    if (type == 'put' || type == 'delete') {
      opts.type = 'post';
      opts.data = opts.data || {};
      opts.data._method = type;
    }

    delete opts.context; // to avoid it calling the original context's success method

    $.ajax(opts);
  },

  onSuccess: function(response, opts) {
    this._clearRequest(opts);
    this._callback(response, opts, 'success');
  },

  onError: function(response, opts) {
    this.app.checkConnection(); // should be non asych
    if (this.app.connected()) {
      this._clearRequest(opts);
      this._callback(response, opts, 'error');
    }
  },

  onComplete: function(response, opts) {
    this._requestCount --;
    this._callback(response, opts, 'complete');
    this.start();
  },

  _clearRequest: function(opts) {
    if (opts.context && opts.context._uid) {
      delete this._contexts[opts.context._uid];
    }
    this._requests.splice(this._requests.indexOf[opts], 1);
  },

  _callback: function(response, opts, name) {
    if (opts[name]) {
      if (opts.context) {
        opts[name].apply(opts.context, [response]);
      } else {
        opts[name](response);
      }
    }
  }
}, {
  connectionLimit: function() {
    if (!this._connectionLimit) {
      this._connectionLimit = (Wheel.Utils.Loader.canZepto() ? 6 : 2);
    }
    return this._connectionLimit;
  }
});
