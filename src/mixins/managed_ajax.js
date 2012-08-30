Wheel.Mixins.ManagedAjax = $.extend({}, Wheel.Mixins.Ajax, {
  _send: function(opts) {
    opts.context || (opts.context = this);
    this._requestQueue = this._requestQueue || Wheel.Utils.RequestQueue.singleton;
    this._requestQueue.add(opts);
  }
});
