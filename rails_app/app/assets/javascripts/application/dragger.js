var Dragger = Wheel.View.subclass({
  init: function() {
    $(document.body).append(this.$);
    this.$jsDrag = $('.dragger');
    this.$nativeDrag = $('.html_draggable');
  },

  listen: function() {
    this.listenForNative();

    var self = this;
    this.$jsDrag.on('mousedown', function(e) {
      $(this).trigger($.Event('dragstart', e));
      // trigger dragstart
    }).on('dragstart', function(e) {
      self.onDragstart(e);
    });
  },

  listenForNative: function() {
    // waits for taphold to add spring loading
    this.$nativeDrag
      .on('taphold', function(e) {
        $(this).attr('draggable', true);
      })
      .on('dragstart', function(e) {
        console.log('starting drag on', e.target, e.dataTransfer);
      })
      .on('dragenter', function(e) {
        console.log('drag enter on', e.target, e.dataTransfer);
      })
      .on('dragover', function(e) {
        //console.log('drag over on', e.target, e.dataTransfer);
      })
      .on('dragleave', function(e) {
        console.log('drag leave on', e.target, e.dataTransfer);
      })
      .on('dragend', function(e) {
        console.log('dragend on', e.target, e.dataTransfer);
        $(this).removeAttr('draggable');
      })
  },

  onDragstart: function(e) {
    $(e.target)
      .addClass('dragging')
      .css('left', 0)
      .css('top', 0);
  },

  onDragmove: function(e) {
  }
}, {
  template: function() {
    return "\
    <div class='line'>\
      <h4>JS Drag</h4>\
      <div class='dragger dropper'>A</div>\
      <div class='dragger dropper'>B</div>\
      <div class='dragger dropper'>C</div>\
      <div class='dragger dropper'>D</div>\
      <div class='dragger dropper'>E</div>\
    </div>\
    <div class='line'>\
      <h4>Spring Loaded Native HTML Drag</h4>\
      <div class='html_draggable'>a</div>\
      <div class='html_draggable'>b</div>\
      <div class='html_draggable'>c</div>\
      <div class='html_draggable'>d</div>\
      <div class='html_draggable'>d</div>\
    </div>\
    "
  }
});
