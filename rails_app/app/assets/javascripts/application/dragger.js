// drag manager is a class level object
// keeps track of
//  - drag element
//  - helper
//  - over elements
//  - droppable elements

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
      e.preventDefault(); // doesn't select text elements on the page
      self.$dragElement.trigger($.Event('dragmove', e));
    };

    function onEnd(e) {
      e.preventDefault();
      self.$dragElement.trigger($.Event('dragend', e));
      self.$body.unbind('mousemove', onMove);
      self.$body.unbind('mouseup', onEnd);
    };

    this.$dropZones = this.$jsDrag;
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
      })
      .on('dragover', function(e) {
        self.onDragover(e);
      })
      .on('dragenter', function(e) {
        self.onDragenter(e);
      })
      .on('dragleave', function(e) {
        self.onDragleave(e);
      });
  },

  onDragstart: function(e) {
    this.$dragTarget = $(e.target);
    this.targetOffset = this.$dragTarget.offset();
    this.targetOffset.left -= parseInt(this.$dragTarget.css('margin-left')) || 0;
    this.targetOffset.top -= parseInt(this.$dragTarget.css('margin-top')) || 0;

    // clone a drag helper
    this.$dragger = this.$dragTarget.clone(false).wrap($('<div/>').addClass('drag_wrapper'));
    this.$dragger.addClass('dragger');

    this.draggerOffset = {
      x: e.pageX - this.targetOffset.left,
      y: e.pageY - this.targetOffset.top
    };

    this.positionDragger(e);
    this.$dragTarget.parent().prepend(this.$dragger);
  },

  onDragmove: function(e) {
    this.positionDragger(e);
    this.calculateDragOver(e);
  },

  onDragend: function(e) {
    this.revertDragger();
  },

  onDragenter: function(e) {
    console.log('drag enter on', e.target);
  },

  onDragover: function(e) {
    console.log('drag over on', e.target, e);
  },

  onDragleave: function(e) {
    console.log('drag leave on', e.target);
  },

  positionDragger: function(e) {
    this.$dragger
      .css('left', e.pageX - this.draggerOffset.x)
      .css('top', e.pageY - this.draggerOffset.y);
  },

  revertDragger: function(e) {
    this.$dragger.addClass('drag_revert');
    this.$dragger.removeClass('dragging');
    this.$dragger.css('left', this.targetOffset.left);
    this.$dragger.css('top', this.targetOffset.top);
    this.$over = null;

    // remove the drag revert class after animation
    duration = Wheel.Mixins.Animatrix.duration(this.$dragger);
    var self = this;
    setTimeout(function() {
      self.$dragger.remove();
    }, duration);
  },

  calculateDragOver: function(e) {
    var self = this;
    this.$dropZones.each(function(index, element) {
      if (found) {return}
      element = $(element);
      var offset = $(element).offset(),
          found = false;
      // going to pretend there is only one dragOver element at a time
      // which wouldn't be true for nested elements that are all dropzones
      if ( e.pageX > offset.left && e.pageX < offset.left + offset.width
            && e.pageY > offset.top && e.pageY < offset.left + offset.width ) {

        if ( !self.$over || element[0] != self.$over[0] ) {
          if (self.$over) {
            self.$over.trigger($.Event('dragleave', e));
          }
          self.$over = element;
          self.$over.trigger($.Event('dragenter', e));
        }
        self.$over.trigger($.Event('dragover', e));
        found = true;
      }
    });
  },

  listenForNative: function() {
    // waits for taphold to add spring loading
    this.$nativeDrag
      .on('mousedown', function(e) {
        $(this).attr('draggable', true);
      })
      .on('dragstart', function(e) {
        //console.log('dragstart on ', e.target);
      })
      .on('dragenter', this.onDragenter)
      .on('dragover', this.onDragover)
      .on('dragleave', this.onDragleave)
      .on('dragend', function(e) {
        console.log('dragend on', e.target);
        $(this).removeAttr('draggable');
      })
      .on('drop', function(e) {
        console.log('dropping');
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
