var MyViewClass = Wheel.View.subclass(
  {
    listen: function() {
      this.$.on('click', function(e) {
        console.log(e.target, 'was clicked. Hmmm. Whatever.');
        e.preventDefault();
      });
    }
  },
  {
    selector: '.useless_and_chatty',
    template: function() {
      return "<a href='/no_hacer_lo'>Just don't do it!</a>"
    }
  }
);
