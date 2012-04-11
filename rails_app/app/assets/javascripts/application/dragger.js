var Dragger = Wheel.View.subclass({
  init: function() {
    $(document.body).append(this.$);
    this.$jsDrag = $('.dragger');
    this.$nativeDrag = $('.html_draggable');
    this.$body = $(document.body);
  },

  listen: function() {
    this.listenForNative();

    // JS-ONLY DRAG
    // listen for mouse events and trigger corresponding drag
    var self = this;
    function onMove(e) {
      e.preventDefault();
      self.$dragElement.trigger($.Event('dragmove', e));
    };

    function onEnd(e) {
      e.preventDefault();
      self.$dragElement.trigger($.Event('dragend', e));
      self.$body.unbind('mousemove', onMove);
      self.$body.unbind('mouseup', onEnd);
    };

    this.$jsDrag
      .on('mousedown', function(e) {
        e.preventDefault();
        self.$dragElement = $(this);
        self.$dragElement.trigger($.Event('dragstart', e));
        self.$body.on('mousemove', onMove);
        self.$body.on('mouseup', onEnd);
      })

    // listen for drag events, that have been js triggerd
    this.$jsDrag
      .on('dragstart', function(e) {
        self.onDragstart(e);
      })
      .on('dragmove', function(e) {
        self.onDragmove(e);
      })
      .on('dragend', function(e) {
        self.onDragend(e);
      });
  },

  onDragstart: function(e) {
    $(e.target)
      .addClass('dragging')
      .css('left', 0)
      .css('top', 0);

    this.offset = {x: e.pageX, y: e.pageY };
  },

  onDragmove: function(e) {
    $(e.target)
      .css('left', e.pageX - this.offset.x)
      .css('top', e.pageY - this.offset.y);
  },

  onDragend: function(e) {
  },

  listenForNative: function() {
    // waits for taphold to add spring loading
    this.$nativeDrag
      .on('mousedown', function(e) {
        $(this).attr('draggable', true);
      })
      .on('dragstart', function(e) {
        console.log('starting drag on', e.target);
      })
      .on('dragenter', function(e) {
        console.log('drag enter on', e.target);
      })
      .on('dragover', function(e) {
        //console.log('drag over on', e.target);
      })
      .on('dragleave', function(e) {
        console.log('drag leave on', e.target);
      })
      .on('dragend', function(e) {
        console.log('dragend on', e.target);
        $(this).removeAttr('draggable');
      })
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
