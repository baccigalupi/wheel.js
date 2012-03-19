jlisten.mixins.Optionize = {
  optionize: function(opts) {
    var opt;
    for( opt in opts ) {
      this[opt] = opts[opt];
    }
  }
};
