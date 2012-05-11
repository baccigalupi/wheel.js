Wheel.Utils.RequestQueue = Wheel.Class.Singleton.subclass({
  init: function() {
    this.requestCount = 0;
    this.requests = [];
    this.contexts = [];
  },

  add: function(requestOpts) {
    this.requests.push(requestOpts);
    this.start();
  },

  start: function(index) {
    index = index || 0;
    var opts = this.requests[index];
    if ( opts && this.app.connected() && this.requestCount < this._class.connectionLimit() ) {
      if ( !opts._inProgress ) {
        this.send(opts);
        this.requests[index]._inProgress = true;
        opts.context && opts.context._uid && this.contexts.push(opts.context._uid);
        this.requestCount ++;
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

    $.ajax(opts);
  },

  onSuccess: function() {
    
  },

  onError: function() {
    
  },

  onComplete: function() {
    
  }
}, {
  connectionLimit: function() {
    if (!this._connectionLimit) {
      this._connectionLimit = (Wheel.Utils.Loader.canZepto() ? 6 : 2);
    }
    return this._connectionLimit;
  }
});
