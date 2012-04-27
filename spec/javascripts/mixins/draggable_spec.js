xdescribe('Wheel.Mixins.Draggable', function() {
  var draggable,
  MyDraggable = Wheel.Class({
    init: function() {
      this.$draggable = this.$.find('draggable');
      this.$droppable = this.$.find('droppable');
    }
  }, {
    template: function() {
      return "\
        <div class='draggable'/>\
        <div class='draggable'/>\
        <div class='droppable'/>\
      "
    }
  });
  MyDraggable.mixin(Wheel.Mixins.Draggable);

  beforeEach(function() {
    draggable = new MyDraggable({parent: $(document.body)});
  });

  it('', function() {
    
  });
});
