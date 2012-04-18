describe("Wheel.Class", function() {
  var SubClass, subclass, Subby, subby;

  it("is a function", function() {
    expect(typeof Wheel.Class).toBe('function');
  });

  beforeEach(function() {
    SubClass = Wheel.Class.subclass({
      foo: 'bar',
      zardoz: function() {this.hasMoxy = true}
    }, {
      classy: true,
      bar: function() { this.canHasSuper = true; }
    });
  });

  describe("subclassing", function () {
    beforeEach(function() {
      Subby = SubClass.subclass({
        bof: 'bof',
        foo: function() {
          if ( this._super ) {
            return 'Let there be foo';
          }
        },
        zardoz: function() {
          this._super();
          if(this.hasMoxy) {
            return "Zardoz has moxy!";
          }
        },
      }, {
        baz: 'baz',
        classy: function() {
          if ( this._super ) {
            return 'I am classy';
          }
        },
        bar: function() {
          this._super();
          if ( this.canHasSuper ) {
            return 'I can has Super';
          }
        }
      });

      subclass = new SubClass();
      subby = new Subby();
    });

    describe('convenience and propigation attributes', function() {
      it("has a class method subclass", function () {
        expect(typeof SubClass.subclass).toBe('function');
      });

      it("has a reference to its super class", function () {
        expect(SubClass.superclass).toBe(Wheel.Class);
      });

      it("passes on the subclass method during inheritance", function () {
        expect(SubClass.subclass).toBe(Wheel.Class.subclass);
      });
    });

    describe("identity", function () {
      it("is an instance of Wheel.Class", function () {
        expect(subclass instanceof Wheel.Class).toBe(true);
      });

      it("is an instance of its class", function () {
        expect(subby instanceof SubClass).toBe(true);
      });

      it("is an instance of its superclass", function () {
        expect(subby instanceof Subby).toBe(true);
      });
    });

    describe('class inheritance', function() {
      it('gains new class attributes', function () {
        expect(Subby.baz).toBe('baz');
      });

      it('maintains a reference to old class variables', function () {
        expect(Subby.classy()).toBe('I am classy');
      });

      it('maintains a reference to old class methods', function () {
        expect(Subby.bar()).toBe('I can has Super');
      });
    });

    describe("instance attributes", function () {
      it('gains new instance attributes', function () {
        expect(subby.bof).toBe('bof');
      });

      it('maintains a reference to old instance variables', function () {
        expect(subby.foo()).toBe('Let there be foo');
      });

      it('maintains a reference to old instance methods', function () {
        expect(subby.zardoz()).toBe('Zardoz has moxy!');
      });
    });
  });

  describe('mashin', function() {
    beforeEach(function() {
      Subby = SubClass.subclass();
      Subby.mashin({
        baz: 'baz',
        classy: function() {
          if ( this._super ) {
            return 'I am classy';
          }
        },
        bar: function() {
          this._super();
          if ( this.canHasSuper ) {
            return 'I can has Super';
          }
        }
      });
    });

    it('gains new class attributes', function () {
      expect(Subby.baz).toBe('baz');
    });

    it('maintains a reference to old class variables', function () {
      expect(Subby.classy()).toBe('I am classy');
    });

    it('maintains a reference to old class methods', function () {
      expect(Subby.bar()).toBe('I can has Super');
    });
  });

  describe('mixin', function() {
    beforeEach(function() {
      Subby = SubClass.subclass({});
      Subby.mixin({
        bof: 'bof',
        foo: function() {
          if ( this._super ) {
            return 'Let there be foo';
          }
        },
        zardoz: function() {
          this._super();
          if(this.hasMoxy) {
            return "Zardoz has moxy!";
          }
        },
      });

      subby = new Subby();
    });

    it('gains new instance attributes', function () {
      expect(subby.bof).toBe('bof');
    });

    it('maintains a reference to old instance variables', function () {
      expect(subby.foo()).toBe('Let there be foo');
    });

    it('maintains a reference to old instance methods', function () {
      expect(subby.zardoz()).toBe('Zardoz has moxy!');
    });

    describe('mixing something into multiple classes', function () {
      var A, B, mix, a, b;
      beforeEach(function() {
        A = Wheel.Class.subclass({
          initialize: function() {
            this.it = 'a';
          }
        });
        B = Wheel.Class.subclass({
          initialize: function() {
            this.it = 'b';
          }
        });

        mix = {
          initialize: function () {
            this._super();
            this.it = this.it + ' mix';
          }
        };

        A.mixin(mix);
        B.mixin(mix);

        a = new A();
        b = new B();
      });

      it("everything should maintain its superness", function () {
        expect(a.it).toBe('a mix');
        expect(b.it).toBe('b mix');
      })
    });
  });
});

describe('Wheel.canZepto', function() {
  var browsers;

  describe('Desktop Safari ', function() {
    browsers = [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10", 
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1", 
      "Mozilla/5.0 (Windows; U; Windows NT 6.1; tr-TR) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27", 
      "Mozilla/5.0 (Windows; U; Windows NT 6.1; sv-SE) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4", 
      "Mozilla/5.0 (Windows; U; Windows NT 6.1; zh-HK) AppleWebKit/533.18.1 (KHTML, like Gecko) Version/5.0.2 Safari/533.18.5", 
      "Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/533.17.8 (KHTML, like Gecko) Version/5.0.1 Safari/533.17.8", 
      "Mozilla/5.0 (X11; U; Linux x86_64; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/531.2+"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Version\/(5\.\d+.\d?)/)[1];
        it('should allow version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( true );
        });

      })(browsers[i]);
    }

    browsers = [
      "Mozilla/5.0 (Windows; U; Windows NT 5.0; en-en) AppleWebKit/533.16 (KHTML, like Gecko) Version/4.1 Safari/533.16",
      "Mozilla/5.0 (Windows; U; Windows NT 6.0; ru-RU) AppleWebKit/528.16 (KHTML, like Gecko) Version/4.0 Safari/528.16",
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; cs-CZ) AppleWebKit/525.28.3 (KHTML, like Gecko) Version/3.2.3 Safari/525.29",
      "Mozilla/5.0 (Windows; U; Windows NT 6.0; sv-SE) AppleWebKit/523.13 (KHTML, like Gecko) Version/3.0 Safari/523.13",
      "Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/419 (KHTML, like Gecko) Safari/419.3",
      "Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/312.8 (KHTML, like Gecko) Safari/312.5"
    ]; 

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Version\/(\d+\.\d+.\d?)/);
        version = version ? version[1] : 'other';
        
        it('should not allow version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( false );
        });

      })(browsers[i]);
    }
  });

  describe('Desktop Chrome', function() {
    browsers = [
      "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.9 (KHTML, like Gecko) Chrome/5.0.307.1 Safari/532.9",
      "Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.1.15) Gecko/20101027 Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/534.10 (KHTML, like Gecko) Chrome/7.0.540.0 Safari/534.10",
      "Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Ubuntu/9.10 Chromium/9.0.592.0 Chrome/9.0.592.0 Safari/534.13",
      "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/9.0.596.0 Safari/534.13",
      "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.638.0 Safari/534.16",
      "Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.14 Safari/534.24",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_8) AppleWebKit/534.31 (KHTML, like Gecko) Chrome/13.0.748.0 Safari/534.31",
      "Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.2 (KHTML, like Gecko) Ubuntu/11.10 Chromium/15.0.874.120 Chrome/15.0.874.120 Safari/535.2",
      "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.3 (KHTML, like Gecko) Chrome/19.0.1063.0 Safari/536.3",
      "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Chrome\/(\d+\.\d+\.\d+)/);
        version = version ? version[0] : useragent;
        it('should allow version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( true );
        });

      })(browsers[i]);
    }

    browsers = [
      "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.1.249.1025 Safari/532.5", 
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-US) AppleWebKit/532.8 (KHTML, like Gecko) Chrome/4.0.302.2 Safari/532.8",
      "Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/3.0.198 Safari/532.0",
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/1.0.154.48 Safari/525.19",
      "Mozilla/5.0 (Macintosh; U; Mac OS X 10_6_1; en-US) AppleWebKit/530.5 (KHTML, like Gecko) Chrome/ Safari/530.5"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Chrome\/(\d+\.\d+\.\d+)/);
        version = version ? version[0] : useragent;
        it('should not allow version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( false );
        });

      })(browsers[i]);
    }
  });

  describe('Desktop Firefox', function() {
    browsers = [
      "Mozilla/5.0 (X11; U; Linux i686; en-GB; rv:2.0) Gecko/20110404 Fedora/16-dev Firefox/4.0",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:14.0) Gecko/20120405 Firefox/14.0a1",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:9.0) Gecko/20100101 Firefox/9.0",
      "Mozilla/5.0 (X11; U; Linux i586; de; rv:5.0) Gecko/20100101 Firefox/5.0"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Firefox\/(\d+\.\d+)/);
        version = version ? version[0] : useragent;
        it('should allow version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( true );
        });

      })(browsers[i]);
    }

    browsers = [
      "Mozilla/5.0 (X11; U; Linux i686; pl-PL; rv:1.9.0.2) Gecko/20121223 Ubuntu/9.25 (jaunty) Firefox/3.8",
      "Mozilla/5.0 (Windows; U; Windows NT 6.1; fr; rv:1.9.2.8) Gecko/20100722 Firefox 3.6.8 GTB7.1",
      "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10.4; en-GB; rv:1.9.2.19) Gecko/20110707 Firefox/3.6.19",
      "Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.0.7) Gecko/2009030423 Ubuntu/8.10 (intrepid) Firefox/3.0.7",
      "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.8.1.14) Gecko/20080404 Firefox/2.0.0.17",
      "Mozilla/5.0 (Windows; U; Windows NT 5.0; zh-TW; rv:1.8.0.1) Gecko/20060111 Firefox/0.10"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Firefox\/(\d+\.\d+)/);
        version = version ? version[0] : useragent;
        it('should not allow version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( false );
        });

      })(browsers[i]);
    }
  });

  describe('ios', function() {
    browsers = [
      "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7",
      "Mozilla/5.0(iPad; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Version\/(\d+\.\d+)/);
        var brand = useragent.match(/ipad|iphone/i)[0];
        version = version ? version[0] : useragent;
        it('should allow '+ brand +' version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( true );
        });

      })(browsers[i]);
    }

      browsers = [
        "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/3.0.5 Mobile/8A293 Safari/6531.22.7",
        "Mozilla/5.0(iPad; U; CPU iPhone OS 3_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/3.0.4 Mobile/7B314 Safari/531.21.10"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Version\/(\d+\.\d+)/);
        version = version ? version[0] : useragent;
        var brand = useragent.match(/ipad|iphone/i)[0];
        it('should not allow '+ brand +' version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( false );
        });

      })(browsers[i]);
    }
  });

  describe('android', function() {
    browsers = [
      "Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
      "Mozilla/5.0 (Linux; U; Android 2.3.1; en-us; device Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.1 Safari/533.1"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Android (\d+\.\d+)/);
        version = version ? version[0] : useragent;
        it('should allow  version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( true );
        });

      })(browsers[i]);
    }

  });

  describe('palm', function() {
    browsers = ["Mozilla/5.0 (webOS/1.4.5; U; es-US) AppleWebKit/532.2 (KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.1"];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/webOS\/(\d+\.\d+\.\d+)/);
        version = version ? version[0] : useragent;
        it('should allow version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( true );
        });

      })(browsers[i]);
    }

    browsers = [
      "Mozilla/5.0 (webOS/1.2.2; U; es-US) AppleWebKit/532.2 (KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.1"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/webOS\/(\d+\.\d+\.\d+)/);
        version = version ? version[0] : useragent;
        it('should allow not version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( false );
        });

      })(browsers[i]);
    }
  });

  describe('blackberry tablets', function() {
    it('should allow versions at or above 1.0.7', function() {
      navigator.useragent = "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.7; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/0.0.1 Safari/534.8+";
      expect( Wheel.canZepto() ).toBe( true );
    });

    it('should not allow versions below 1.0.7', function() {
      navigator.useragent = "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.6; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/0.0.1 Safari/534.8+";
      expect( Wheel.canZepto() ).toBe( false );
    });
  });

  describe('amazon silk', function() {
    browsers = [
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.0.0-80) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true",
      "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Silk/1.0.0-80) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 Silk-Accelerated=false"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        it('should allow ' + useragent, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( true );
        });

      })(browsers[i]);
    }

    browsers = [
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/0.9.0) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true",
      "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Silk/0.9.0) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 Silk-Accelerated=false"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        it('should not allow version ' + useragent, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( false );
        });

      })(browsers[i]);
    }
  });

  describe('opera', function() {
    browsers = [
      "Opera/9.80 (X11; Linux x86_64; U; en) Presto/2.2.15 Version/10.00",
      "Opera/9.80 (Windows NT 6.1; U; fi) Presto/2.7.62 Version/11.00",
      "Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.9.168 Version/11.50",
      "Opera/9.80 (Windows NT 6.1; U; es-ES) Presto/2.9.181 Version/12.00"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        var version = useragent.match(/Version\/(\d+\.\d+)/);
        version = version ? version[0] : useragent;
        it('should allow version ' + version, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( true );
        });

      })(browsers[i]);
    }

    browsers = [
      "Opera/9.99 (Windows NT 5.1; U; pl) Presto/9.9.9",
      "Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux i686; en) Opera 8.02",
      "Mozilla/5.0 (Linux 2.4.21-0.13mdk i686; U) Opera 7.11 [en]",
      "Opera/6.04 (Windows 2000; U) [en]",
      "Mozilla/5.0 (Macintosh; ; Intel Mac OS X; fr; rv:1.8.1.1) Gecko/20061204 Opera"
    ];

    for(var i = 0; i < browsers.length; i++) {
      (function(useragent) { 

        it('should allow not version ' + useragent, function() {
          navigator.useragent = useragent;
          expect( navigator.useragent ).toBe( useragent );
          expect( Wheel.canZepto() ).toBe( false );
        });

      })(browsers[i]);
    }
  });
});

