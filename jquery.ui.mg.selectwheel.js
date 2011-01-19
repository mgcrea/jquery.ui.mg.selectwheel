
 /*
 * jQuery UI Selectwheel plugin
 *
 * Copyright (c) 2010 Magenta Creations. All rights reserved.
 * Licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License.
 *  Summary : <http://creativecommons.org/licenses/by-nc-sa/3.0/>
 *  Legal : <http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode>
 *
 * Royalty-free license for commercial purpose available on demand
 *
 * contact@mg-crea.com
 * http://mg-crea.com
 */


(function( $, console, undefined ) {

$.widget("ui.selectwheel", $.ui.mouse, {
	widgetEventPrefix: "selectwheel",
	options: {
		active: 'ui-state-active',
		target: 'select, ul',
		wrap: false,
		frame: true,
		transferClasses: true,
		distance: 5, // $.ui.mouse option
		delay: 5, // $.ui.mouse option
		debug: true
	},
	_mouseStart: function(e) {
		//console.log('$.ui.' + self.widgetName + ' ~ ' + '_mouseStart()', e);
	},
	_mouseDrag: function(e) {
		//console.log('$.ui.' + self.widgetName + ' ~ ' + '_mouseDrag()', e);
		this.scrollTo(this._mouseCaptureEvent.currentSlot, this._mouseCaptureEvent.slotYPos + (e.pageY - this._mouseDownEvent.pageY));
	},
	_mouseStop: function(e) {
		console.log('$.ui.' + this.widgetName + ' ~ ' + '_mouseStop()', e);
		var i = this._mouseCaptureEvent.currentSlot // currentSlot
			j = this.getCurrentOption(i), // currentOption
			o = this.options;
		this._mouseCaptureEvent.stopped = true;

		//this._mouseCaptureEvent.slotYPos = this.slots[this._mouseCaptureEvent.currentSlot].list.css('top').replace(/px/g, '') * 1;
		console.log('$.ui.' + this.widgetName + ' ~ ' + this.slots[i].slotYPos, [this.slots[i].middleOffset, this.slots[i].listLiHeight * j]);
		this.scrollTo(i, this.slots[i].middleOffset - (this.slots[i].listLiHeight * j));

		// toggle active class on selected li ~ to style selected content
		this.slots[i].list.children("li").removeClass(o.active).filter(":eq("+j+")").addClass(o.active);

		// SHOULD TRIGGER SOME EVENT
		// toggle input select ~ to retreive selected value
		//this.slots[i].select.val(j);
	},
	_mouseCapture: function(e) {
		console.log('$.ui.' + this.widgetName + ' ~ ' + '_mouseCapture', e);
		var self = this,
			o = this.options;

		// find current slot
		self.getCurrentSlot(e);

		e.deltaY = 0, e.slotYPos = this.slots[e.currentSlot].list.css('top').replace(/px/g, '') * 1;//, e.slotCssWtY = splitCssMatrix(this.slots[e.currentSlot].list.css('-webkit-transform'), 6) * 1;

		this._mouseCaptureEvent = e;

		e.preventDefault();
		e.stopPropagation();
		return true;
	},
	_mouseClick: function(e) {
		var self = $.data(this, "selectwheel");
		console.log('$.ui.' + self.widgetName + ' ~ ' + '_mouseClick', e);
		var $t = $(e.target);

		if(!self._mouseCaptureEvent.stopped) {
			self.scrollTo(self._mouseCaptureEvent.currentSlot,
				self._mouseCaptureEvent.slotYPos + (self.slots[self._mouseCaptureEvent.currentSlot].elementHeight/2 - e.offsetY)
			);
			self._mouseStop(self._mouseCaptureEvent);
		}

		e.preventDefault();
		e.stopPropagation();
	},
	refreshSlot: function(i) {
		$.extend(this.slots[i], {
			listLength :  this.slots[i].list.children("li").length,
			listWidth : this.slots[i].list.width(),
			listOffset : this.slots[i].list.offset(),
			listLiHeight : this.slots[i].list.children("li:first").height(),
			elementHeight : this.element.height(),
			slotYPos : 0
		});

		$.extend(this.slots[i], {
			middleOffset : Math.ceil((this.slots[i].elementHeight - this.slots[i].listLiHeight)/2)
		});
	},
	getCurrentSlot: function(e) {
		$.each(this.slots, function(i) {
			if(e.pageX - this.list.offset().left > 0) e.currentSlot = i * 1;
		});
		return e.currentSlot;
	},
	getCurrentOption: function(i) {
		var c = (-Math.round((this.slots[i].slotYPos - this.slots[i].middleOffset) / this.slots[i].listLiHeight));
		return (c < 0) ? 0 : (c > this.slots[i].listLength - 1) ? this.slots[i].listLength - 1 : c;
	},

	scrollTo: function (slot, destY, tempo) {
		//console.log('scrollTo', [slot, destY, tempo]);
		this.setPosition(slot, destY ? destY : 0, tempo);

		// If we are outside of the boundaries go back to the sheepfold
		/*if (this.slotEl[slotNum].slotYPosition > 0 || this.slotEl[slotNum].slotYPosition < this.slotEl[slotNum].slotMaxScroll) {
			this.slotEl[slotNum].addEventListener('webkitTransitionEnd', this, false);
		}*/
	},
	setPosition: function (slot, destY, tempo) {
		//console.log('setPosition', [slot, destY, tempo]);

		//transition 1 ~ pur wT
		//if(tempo) this.slots[slot].list.css('-webkit-transition-duration', tempo);
		//this.slots[slot].list.css('-webkit-transform', 'translate3d(0px, ' + (this._mouseCaptureEvent.slotCssWtY + destY) + 'px, 0px)');

		//transition 2 ~ animate.enhanced
		//if(tempo) this.slots[slot].list.css('-webkit-transition-duration', tempo);

		this.slots[slot].list.animate({top: destY}, tempo ? tempo : 0, function() {});
		this.slots[slot].slotYPos = destY;

		//transition 3 ~ css top
		//this.slots[slot].list.css('top', this._mouseCaptureEvent.slotCssTop + destY);

		// deprecated
		//this.slots[slot].list.slotYPosition = destY;
		//this.slots[slot].list.bind('webkitTransitionEnd', function(e) { console.log('!!!'); });
	},


	_create: function() {
		console.log('$.ui.' + this.widgetName + ' ~ ' + '_create()', [this.options]);
		this._selectwheel( true );
	},

	_selectwheel: function( init ) {
		var self = this,
			o = this.options;

		if(!o.debug) console = { log: function(){} };

		this.originalElement = this.element;

		if(this.element.get(0).tagName.toLowerCase() === 'ul' || this.element.get(0).tagName.toLowerCase() === 'select') {
			this.element = this.element.wrap($('<div>')).parent('div');
		}

		this.widgetId = self.widgetBaseClass + '-' +  Math.random().toString(16).slice(2, 10);
		if(o.wrap) this.element = this.element.append($('<div>')).children('div:last');
		this.element.addClass(self.widgetBaseClass + ' ui-widget ui-state-default');//.attr('id', this.widgetId);
		//this.wrapper = $('<div>').addClass(self.widgetBaseClass + '-wrapper');

		this.slots = {};

		// convert selects to ul lists
		this.originalElement.find(o.target).each(function(i) {
			var $this = $(this);

			self.slots[i] = {list : $this};

			if($this.is("select")) {

				$.extend(self.slots[i], {select : $this, optionData : []});

				// serialize select element options
				$this.hide().find('option')
					.each(function(){
						var $this = $(this);
						self.slots[i].optionData.push({
							value: $this.attr('value'),
							text: $this.text(),
							selected: $this.attr('selected'),
							classes: $this.attr('class'),
							parentOptGroup: $this.parent('optgroup').attr('label')
						});
					});

				// create list
				self.slots[i].list = $('<ul>').appendTo(self.element);

				// write li's
				for (var j = 0; j < self.slots[i].optionData.length; j++) {
					var $li = $('<li data-value="' + self.slots[i].optionData[j].value + '"><a href="#">'+ self.slots[i].optionData[j].text +'</a></li>');
					if(self.slots[i].optionData[j].selected) {
						$li.addClass("ui-state-selected");
						self.slots[i].selectedLi = j;
					}
					$li.appendTo(self.slots[i].list);
				}

				$this = self.slots[i].list;

			}

			$this.addClass(self.widgetBaseClass + '-list ui-widget ui-widget-content')
				//.attr('data-select-name', self.slots[i].select.attr('name'))
				.css({
					'-webkit-transform': 'translate3d(0px, 0px, 0px)',
					'-webkit-transition-duration': '500ms',
					'-webkit-transition-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
					'position': 'relative',
					'top': '0px'
				});

			self.refreshSlot(i);

			self.setPosition(i, self.slots[i].middleOffset - (self.slots[i].listLiHeight * self.slots[i].selectedLi));

		});

		this.element.bind("refresh", function(e) {
			$.each(self.slots, function(i) {
				self.refreshSlot(i);
				self.setPosition(i, self.slots[i].middleOffset); // self.slots[i].elementHeight - self.slots[i].listLiHeight);
			});
			console.log('$.ui.' + self.widgetName + ' ~ ' + 'refresh()', self.slots);
		});//.trigger("refresh");

		// insert frame
		if (o.frame) this.frame = $('<div>').addClass(self.widgetBaseClass + '-frame').appendTo(this.element);

		// mouse click
		this.element.data("selectwheel", this).bind('click.'+this.widgetName, this._mouseClick);

		// mouse init
		this._mouseInit();

		console.log('$.ui.' + this.widgetName + ' ~ ' + '_selectwheel()', self.slots);

		return true;
	},

	destroy: function() {
		this.element.removeData(this.widgetName)
			.removeClass(this.widgetBaseClass + '-disabled' + ' ' + this.namespace + '-state-disabled')
			.removeAttr('aria-disabled')
			.unbind('click.'+this.widgetName);

		// call mouse destroy function
		this._mouseDestroy();

		// call widget destroy function
		$.widget.prototype.destroy.apply(this, arguments);
	}

});

function splitCssMatrix(m, r) {
	var re = new RegExp('matrix\\(' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?', ["i"]);
	var rs = re.exec(m);
	if(typeof r !== undefined) return rs[r];
	return rs;
}

})(jQuery, console);