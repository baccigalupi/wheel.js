// Adapted from https://github.com/gmosx/inflection, MIT license
//
(function() {
  var PLURALS = [
    [/$/, "s"],
    [/s$/i, "s"],
    [/(ax|test)is$/i, "$1es"],
    [/(octop|vir)us$/i, "$1i"],
    [/(alias|status)$/i, "$1es"],
    [/(bu)s$/i, "$1ses"],
    [/(buffal|tomat)o$/i, "$1oes"],
    [/([ti])um$/i, "$1a"],
    [/sis$/i, "ses"],
    [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"],
    [/(hive)$/i, "$1s"],
    [/([^aeiouy]|qu)y$/i, "$1ies"],
    [/(x|ch|ss|sh)$/i, "$1es"],
    [/(matr|vert|ind)(?:ix|ex)$/i, "$1ices"],
    [/([m|l])ouse$/i, "$1ice"],
    [/^(ox)$/i, "$1en"],
    [/(quiz)$/i, "$1zes"],
    [/(person)$/i, "people"],
    [/(child)$/i, "$1ren"],
    [/(man)$/i, "men"]
  ];

  Wheel.Utils.pluralize = function (word) {
    for (var i = PLURALS.length-1; i >= 0; i--) {
      var rule = PLURALS[i][0];
      var replacement = PLURALS[i][1];
      if (rule.test(word)) {
        return word.replace(rule, replacement);
      }
    }
  }
})();
