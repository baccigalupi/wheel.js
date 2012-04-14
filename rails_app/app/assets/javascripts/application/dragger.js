var Dragger = Wheel.View.subclass({
  init: function() {
    $(document.body).append(this.$);
    this.$jsDrag = $('.draggable');
    this.$nativeDrag = $('.html_draggable');
    this.$body = $(document.body);
  },

  listen: function() {
    this.listenForNative();

    // JS-ONLY DRAG
    // listen for mouse events and trigger corresponding drag
    var self = this;
    function onMove(e) {
      e.preventDefault(); // doesn't text select elements on the page
      self.$dragElement.trigger($.Event('dragmove', e));
    };

    function onEnd(e) {
      e.preventDefault();
      self.$dragElement.trigger($.Event('dragend', e));
      self.$body.unbind('mousemove', onMove);
      self.$body.unbind('mouseup', onEnd);
    };

    this.$jsDrag.on('mousedown', function(e) {
      e.preventDefault();
      self.$dragElement = $(this);
      self.$dragElement.trigger($.Event('dragstart', e));
      self.$body.on('mousemove', onMove);
      self.$body.on('mouseup', onEnd);
    });

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
    this.$dragTarget = $(e.target);
    this.$dragTargetOffset = this.$dragTarget.offset();
    this.$dragTargetOffset.left -= parseInt(this.$dragTarget.css('margin-left')) || 0;
    this.$dragTargetOffset.top -= parseInt(this.$dragTarget.css('margin-top')) || 0;

    // clone a drag helper
    this.$dragger = this.$dragTarget.clone(false).wrap($('<div/>').addClass('drag_wrapper'));
    this.$dragger.addClass('dragger');

    this.offset = {
      x: e.pageX - this.$dragTargetOffset.left,
      y: e.pageY - this.$dragTargetOffset.top
    };

    this.positionDragger(e);
    this.$dragTarget.parent().prepend(this.$dragger);
  },

  onDragmove: function(e) {
    this.positionDragger(e);
  },

  onDragend: function(e) {
    this.revertPosition();
  },

  positionDragger: function(e) {
    this.$dragger
      .css('left', e.pageX - this.offset.x)
      .css('top', e.pageY - this.offset.y);
  },

  revertPosition: function(e) {
    this.$dragger.addClass('drag_revert');
    this.$dragger.removeClass('dragging');
    this.$dragger.css('left', this.$dragTargetOffset.left);
    this.$dragger.css('top', this.$dragTargetOffset.top);
  
    console.log(this.$dragger.css('left'), this.$dragger.css('top'), this.offset);
    // remove the drag revert class after animation
    duration = Wheel.Mixins.Animatrix.duration(this.$dragger);
    var self = this;
    setTimeout(function() {
      self.$dragger.remove();
    }, duration);
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
      <div class='draggable'>A</div>\
      <div class='draggable'>B</div>\
      <div class='draggable'>C</div>\
      <div class='draggable'>D</div>\
      <div class='draggable'>E</div>\
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
