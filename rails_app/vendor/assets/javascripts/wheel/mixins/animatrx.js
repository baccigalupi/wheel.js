Wheel.Mixins.Animatrix = {
  // inspects the duration of a transition
  duration: function($target) {
    var d = $target.css('transition-duration') ||
            $target.css('-webkit-transition-duration') ||
            $target.css('-moz-transition-duration') || 0;
    var duration = 0;

    if ( d ) {
      var times = d.split(/,\s?/),
          timesLength = times.length;
      for(i = 0; i < timesLength; i++) {
        var _duration = this.convertToMs(times[i]);
        duration < _duration && (duration = _duration)
      }
    }
    return duration;
  },

  convertToMs: function(value) {
    var matches = value.match(/(\d+\.?\d*)(\D+)/),
        multiplier;
    multiplier = matches[2] == "s" ? 1000 : 1;
    return +matches[1] * multiplier;
  }
};
