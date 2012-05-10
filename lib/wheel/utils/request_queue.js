Wheel.Utils.RequestQueue = Wheel.Class.Singleton.subclass({
  init: function() {
    this.requestCount = 0;
    this.requests = [];
    this.contexts = [];
  },

  add: function(requestOpts) {
    this.requests.unshift(requestOpts);
    this.send();
  },

  send: function() {
    if ( this.requestCount < this._class.connectionLimit() && this.requests.length ) {
      var originalOpts = this.requests.shift();
      if (originalOpts.context && ('_uid' in originalOpts.context)) {
        this.contexts.push(originalOpts.context._uid);
      }

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
      this.requestCount ++;
    }
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
