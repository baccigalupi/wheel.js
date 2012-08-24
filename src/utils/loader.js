Wheel.Utils.Loader = {
  canZepto: function(agent) {
    agent = agent || navigator.userAgent;
    var is = false;

    if ( /AppleWebKit/i.test(agent) ) {
      if ( /Silk\/(\d+)/i.test(agent) ) { // amazon silk
        is = parseInt(agent.match(/Silk\/(\d+)/i)[1]) >= 1;
      } else if (/mobile|android/i.test(agent) ) { // general mobile
        is = parseInt(agent.match(/version\/(\d+)/i)[1]) >= 4;
      } else if ( /webos\/(\d+)\.(\d+)\.(\d+)/i.test(agent) ) { // palm
        is = this._versionTest(agent.match(/webos\/(\d+)\.(\d+)\.(\d+)/i), [1,4,5]);
      } else if ( /RIM Tablet OS (\d+)\.(\d+)\.(\d+)/i.test(agent) ) { // blackberry tablet
        is = this._versionTest(agent.match(/RIM Tablet OS (\d+)\.(\d+)\.(\d+)/i), [1,0,7]);
      } else { // desktop webkit browsers
        is = (
          ( agent.match(/Chrome\/(\d+)/) && parseInt(agent.match(/Chrome\/(\d+)/)[1]) >= 5 ) ||
          /Version\/5.*Safari/.test(agent)
        );
      }
    } else {
      is = (
        ( agent.match(/Firefox\/(\d+)/) && parseInt(agent.match(/Firefox\/(\d+)/)[1]) >= 4 ) ||
        ( agent.match(/(Opera).*Version\/(\d+)/i) && parseInt(agent.match(/Version\/(\d+)/i)[1]) >= 10 )
      )
    }

    return !!is;
  },

  _versionTest: function (matches, required) {
    matches[1] = parseInt(matches[1]);
    matches[2] = parseInt(matches[2]);
    matches[3] = parseInt(matches[3]);
    return matches[1] >= required[0] &&
      ( matches[2] > required[1] || (matches[2] == required[1] && matches[3]>= required[2]) ) ;
  }
};


