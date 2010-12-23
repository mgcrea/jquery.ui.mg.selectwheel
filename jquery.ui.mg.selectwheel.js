
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

(function( $, undefined ) {

$.widget("ui.selectwheel", $.ui.mouse, {
	widgetEventPrefix: "selectwheel",
	options: {
		transferClasses: true,
		distance: 5, // $.ui.mouse option
		delay: 5, // $.ui.mouse option
		debug: true
	},
	_mouseStart: function(e) {
		//if(this.options.debug) console.log("$.ui." + self.widgetName + " ~ +'_mouseStart', e);
	},
	_mouseDrag: function(e) {
		//if(this.options.debug) console.log("$.ui." + self.widgetName + " ~ +'_mouseDrag', e);
		this.scrollTo(this._mouseCaptureEvent.currentSlot, this._mouseCaptureEvent.slotYPos + (e.pageY - this._mouseDownEvent.pageY));
	},
	_mouseStop: function(e) {
		var self = this,
			o = this.options;

		if(o.debug) console.log('$.ui.' + self.widgetName + ' ~ ' + '_mouseStop', e);

		var i = this._mouseCaptureEvent.currentSlot;
		this._mouseCaptureEvent.stopped = true;

		//this._mouseCaptureEvent.slotYPos = t his.slots[this._mouseCaptureEvent.currentSlot].list.css('top').replace(/px/g, '') * 1;
		if(o.debug) console.log('$.ui.' + self.widgetName + ' ~ ' + this.slots[i].slotYPos, [this.slots[i].middleOffset, this.slots[i].listLiHeight * this.getCurrentOption(i)]);
		this.scrollTo(this._mouseCaptureEvent.currentSlot, this.slots[i].middleOffset - (this.slots[i].listLiHeight * this.getCurrentOption(i)));
	},
	_mouseCapture: function(e) {
		var self = this,
			o = this.options;

		if(o.debug) console.log('$.ui.' + self.widgetName + ' ~ ' + '_mouseCapture', e);

		// find current slot
		self.getCurrentSlot(e);

		e.deltaY = 0, e.slotYPos = this.slots[e.currentSlot].list.css('top').replace(/px/g, '') * 1;//, e.slotCssWtY = splitCssMatrix(this.slots[e.currentSlot].list.css('-webkit-transform'), 6) * 1;

		this._mouseCaptureEvent = e;

		e.preventDefault();
		e.stopPropagation();
		return true;
	},
	_mouseClick: function(e) {
		var self = $.data(this, "selectwheel"),
			$t = $(e.target),
			o = self.options;

		if(o.debug) console.log('$.ui.' + self.widgetName + ' ~ ' + '_mouseClick', e);

		if(!self._mouseCaptureEvent.stopped) {
			self.scrollTo(self._mouseCaptureEvent.currentSlot,
				self._mouseCaptureEvent.slotYPos + (self.slots[self._mouseCaptureEvent.currentSlot].elementHeight/2 - e.offsetY)
			);
			self._mouseStop(self._mouseCaptureEvent);
		}

		e.preventDefault();
		e.stopPropagation();
	},

	getCurrentSlot: function(e) {
		$.each(this.slots, function(i) {
			if(e.pageX - this.listOffset.left > 0) e.currentSlot = i * 1;
		});
		return e.currentSlot;
	},
	getCurrentOption: function(i) {
		var c = (-Math.round((this.slots[i].slotYPos - this.slots[i].middleOffset) / this.slots[i].listLiHeight));
		return (c < 0) ? 0 : (c > this.slots[i].optionData.length - 1) ? this.slots[i].optionData.length - 1 : c;
	},

	scrollTo: function (slot, destY, tempo) {
		//if(o.debug) console.log("$.ui." + self.widgetName + " ~ +'scrollTo', [slot, destY, tempo]);
		this.setPosition(slot, destY ? destY : 0, tempo);

		// If we are outside of the boundaries go back to the sheepfold
		/*if (this.slotEl[slotNum].slotYPosition > 0 || this.slotEl[slotNum].slotYPosition < this.slotEl[slotNum].slotMaxScroll) {
			this.slotEl[slotNum].addEventListener('webkitTransitionEnd', this, false);
		}*/
	},
	setPosition: function (slot, destY, tempo) {
		//if(o.debug) console.log("$.ui." + self.widgetName + " ~ +'setPosition', [slot, destY, tempo]);

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
		//this.slots[slot].list.bind('webkitTransitionEnd', function(e) { if(o.debug) console.log("$.ui." + self.widgetName + " ~ +'!!!'); });
	},


	_create: function() {
		console.log('$.ui.' + this.widgetName + ' ~ ' + '_create()', [this.options]);
		this._wheelify( true );
	},

	_wheelify: function( init ) {
		var self = this,
			o = this.options;

		if(o.debug) {
			o.startTime = new Date().getTime();
		} else {
			logger.disableLogger();
		}

		this.originalElement = this.element;

		if(this.element.get(0).tagName.toLowerCase() === 'select') {
			this.element = this.element.wrap($('<div>')).parent('div');
		}

		this.element = this.element.append($('<div>')).children('div:last');

		this.widgetId = self.widgetBaseClass + '-' +  Math.random().toString(16).slice(2, 10);
		this.element.attr('id', this.widgetId).addClass(self.widgetBaseClass + ' ui-widget ui-state-default');
		this.wrapper = $('<div>').addClass(self.widgetBaseClass + '-wrapper');
		this.frame = $('<div>').addClass(self.widgetBaseClass + '-frame');

		this.selects = this.originalElement.find("select").hide();
		this.slots = {};

		$.each(this.selects, function(i) {
			self.slots[i] = {select : $(this), optionData : [], list : undefined};

			// serialize select element options
			self.slots[i].select.find('option')
				.each(function(){
					self.slots[i].optionData.push({
						value: $(this).attr('value'),
						text: $(this).text(),
						selected: $(this).attr('selected'),
						classes: $(this).attr('class'),
						parentOptGroup: $(this).parent('optgroup').attr('label')
					});
				});

			// create list
			self.slots[i].list = $('<ul>').addClass(self.widgetBaseClass + '-list ui-widget ui-widget-content')
				.attr('data-select-name', self.slots[i].select.attr('name'))
				.css({
					'-webkit-transform': 'translate3d(0px, 0px, 0px)',
					'-webkit-transition-duration': '500ms',
					'-webkit-transition-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
					'position': 'relative',
					'top': '0px'
				})
				.appendTo(self.wrapper);

			//write li's
			for (var j = 0; j < self.slots[i].optionData.length; j++) {
				var $li = $('<li data-option-value="' + self.slots[i].optionData[j].value + '"><a href="#">'+ self.slots[i].optionData[j].text +'</a></li>');
				if(self.slots[i].optionData[j].selected) {
					$li.addClass("ui-selected");
					self.slots[i].selectedLi = j;
				}
				$li.appendTo(self.slots[i].list);
			}

		});

		if(o.debug) console.log('$.ui.' + self.widgetName + ' ~ this.slots', this.slots);

		// insert new wrapper
		this.wrapper.appendTo(this.element);
		this.frame.appendTo(this.element);

		this.wrapper.children("ul").each(function(i) {
			self.slots[i].listWidth = $(this).width();
			self.slots[i].listLiHeight = $(this).children("li:first").height();
			self.slots[i].elementHeight = self.element.height();
			self.slots[i].middleOffset = Math.ceil((self.slots[i].elementHeight - self.slots[i].listLiHeight)/2);
			self.slots[i].listOffset = $(this).offset();
			self.slots[i].slotYPos = 0;

			if(o.debug) console.log('$.ui.' + self.widgetName + ' ~ slot[' + i + ']', self.slots[i]);

			self.setPosition(i, self.slots[i].middleOffset - (self.slots[i].listLiHeight * self.slots[i].selectedLi));
		});

		// mouse click
		this.element.bind('click.'+this.widgetName, {'this' : this}, this._mouseClick);

		// mouse init
		this._mouseInit();

		if(o.debug) {
			o.elapsedTime = new Date().getTime() - o.startTime;
			console.log('$.ui.' + this.widgetName + ' ~ ' + '_createEnd() took ' + o.elapsedTime + 'ms');
		}

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

/*
 * logger wrapper
 */

var logger = function() {
	var oldConsoleLog = null;
	var pub = {};

	pub.enableLogger = function enableLogger() {
		if(oldConsoleLog == null) return;
		window['console']['log'] = oldConsoleLog;
	};

	pub.disableLogger = function disableLogger() {
		oldConsoleLog = console.log;
		window['console']['log'] = function() {};
	};

	return pub;
}();

})(jQuery);