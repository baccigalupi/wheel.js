var WrittenWork = Wheel.Class({
  initialize: function(title, body) {
    this.title = title;
    this.body = body;
  },

  warning: function() {
    return "Commitment level of this work is " + this._class.level;
  };
}, {
  level: 'unknown'
});

var Book = WrittenWork.subclass({
  warning: function() {
    return "Warning! " + this._super();
  };
}, {
  level: 'large'
});

var Article = WrittenWork.subclass();
Articles.mashin({commitmentLevel: 'small'});

Book.mixin(MyModule);
