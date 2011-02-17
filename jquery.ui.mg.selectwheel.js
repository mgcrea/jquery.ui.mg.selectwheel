
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


(function($, console, undefined) {

$.widget("ui.selectwheel", $.ui.mouse, {
	widgetEventPrefix: "selectwheel",
	options: {
		active: 'ui-state-active',
		target: 'select, ul',
		create: undefined, // called after creation
		select: undefined, // called after selection
		size: undefined, // used to resize parent wrapper (n lis)
		wrap: false,
		frame: true,
		transferClasses: true,
		use3d: true,
		distance: 5, // $.ui.mouse option
		delay: 5, // $.ui.mouse option
		debug: false
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
		var i = this._mouseCaptureEvent.currentSlot, // currentSlot
			j = this.getCurrentOption(i), // currentOption
			o = this.options;
		this._mouseCaptureEvent.stopped = true;

		//this._mouseCaptureEvent.slotYPos = this.slots[this._mouseCaptureEvent.currentSlot].list.css('top').replace(/px/g, '') * 1;
		console.log('$.ui.' + this.widgetName + ' ~ ' + this.slots[i].slotYPos, [this.slots[i].middleOffset, this.slots[i].listLiHeight, j]);
		this.scrollTo(i, this.slots[i].middleOffset - (this.slots[i].listLiHeight * j));

		// update current option
		this._mouseCaptureEvent.currentOption = j;



		// SHOULD TRIGGER SOME EVENT ~ to select on drag

		// toggle input select ~ to retreive selected value
		//this.slots[i].select.val(j);
	},
	_mouseCapture: function(e) {
		console.log('$.ui.' + this.widgetName + ' ~ ' + '_mouseCapture', e);
		var self = this,
			o = this.options;

		// find current slot
		self.getCurrentSlot(e);

		e.deltaY = 0;
		if(o.use3d) e.slotYPos = splitCssMatrix(this.slots[e.currentSlot].list.css('-webkit-transform'), 6) * 1;
		else this.slots[e.currentSlot].list.css('top').replace(/px/g, '') * 1;

		this._mouseCaptureEvent = e;

		e.preventDefault();
		e.stopPropagation();
		return true;
	},
	_mouseClick: function(e) {
		var self = $.data(this, "selectwheel"),
			o = self.options;

		console.log('$.ui.' + self.widgetName + ' ~ ' + '_mouseClick', e);
		var $t = $(e.target);

		if(!self._mouseCaptureEvent.stopped) {
			// was a click

			// scrollTo position
			self.scrollTo(self._mouseCaptureEvent.currentSlot,
				self._mouseCaptureEvent.slotYPos + (self.slots[self._mouseCaptureEvent.currentSlot].elementHeight/2 - e.offsetY)
			);

			// trigger stop event
			self._mouseStop(self._mouseCaptureEvent);

			var i = self._mouseCaptureEvent.currentSlot, // currentSlot
				j = self._mouseCaptureEvent.currentOption; // currentOption

			// toggle active class on selected li ~ to style selected content
			var v = self.slots[i].list.children("li")
				.filter('.' + o.active).removeClass(o.active).end()
				.filter(":visible").eq(j).addClass(o.active)
				.trigger('select' + '.' + this.widgetName, {currentSlot : i, currentOption : j})
				.data('value');

			// update select val if necessary
			if(!empty(self.slots[i].select)) {
				self.slots[i].select.val(v);
				// erase later slots
				for(var j=i+1; j < count(self.slots);j++) {
					self.slots[j].select.val('');
				}
			}

		} else {
			// was a drag
			//console.log('drag');

			// misses mouseup outside element !
		}

		e.preventDefault();
		e.stopPropagation();
	},
	refreshSlot: function(i) {

		var $visibleLis = this.slots[i].list.children("li:visible");
		//console.log($visibleLis, this.slots[i].list);

		$.extend(this.slots[i], {
			listLength :  $visibleLis.length,
			listWidth : this.slots[i].list.width(),
			listOffset : this.slots[i].list.offset(),
			listLiHeight : $visibleLis.filter(":first").height(),
			elementHeight : this.element.height(),
			selectedLi : $visibleLis.filter(".ui-state-active").length > 0 ? $visibleLis.filter(".ui-state-active").index() : $visibleLis.filter(".ui-state-selected").length > 0 ? $visibleLis.filter(".ui-state-selected").index() : 0,
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
	},
	setPosition: function (slot, destY, tempo) {

		//console.log('setPosition', [slot, destY, tempo]);

		// what is this for ?? update pos for ?
		this.slots[slot].slotYPos = destY;

		//transition 1 ~ pur wT
		if(this.options.use3d) {
			//if(tempo) this.slots[slot].list.css('-webkit-transition-duration', tempo);
			//this.slots[slot].list.css('-webkit-transform', 'translate3d(0, ' + destY + 'px, 0)'); ~ jquery hook ? must run a jsperf on this.
			this.slots[slot].list.get(0).style.webkitTransform = 'translate3d(0, ' + destY + 'px, 0)';
			// useless here but maybe somewhere
			//this.slots[slot].list.unbind('webkitTransitionEnd').bind('webkitTransitionEnd', function(e) { console.log('!!!'); });
		} else {
			this.slots[slot].list.get(0).style.top = destY + 'px';
		}

	},


	_create: function() {
		this._selectwheel(true);
	},

	_selectwheel: function( init ) {
		var self = this,
			o = this.options;

		if(!console || !console.log  || !o.debug) console = { log: function(){} };

		console.log('$.ui.' + this.widgetName + ' ~ ' + '_create()', [this.options]);

		this.originalElement = this.element;

		if(this.element.get(0).tagName.toLowerCase() === 'ul' || this.element.get(0).tagName.toLowerCase() === 'select') {
			this.element = this.element.wrap($('<div>')).parent('div');
		}

		this.widgetId = self.widgetBaseClass + '-' +  Math.random().toString(16).slice(2, 10);
		if($.isFunction(o.select)) this.element.bind('select' + '.' + this.widgetName, o.select);
		if(o.wrap) this.element = this.element.append($('<div>')).children('div:last');
		this.element.addClass(self.widgetBaseClass + ' ui-widget ui-state-default');//.attr('id', this.widgetId);
		//this.wrapper = $('<div>').addClass(self.widgetBaseClass + '-wrapper');

		if(o.use3d) this._mouseCaptureEvent= {slotCssWtY : 0};

		this.slots = {};

		// convert selects to ul lists
		this.originalElement.find(o.target).each(function(i) {
			var $this = $(this);

			self.slots[i] = {list : $this, size : undefined};

			if($this.is("select")) {

				$.extend(self.slots[i], {select : $this, optionData : []});

				// try to get size
				if(!o.size) o.size = $this.attr("size");

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
					'-webkit-transition-duration': '200ms',
					'-webkit-transition-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
					'position': 'relative',
					'top': '0px'
				});

			// slot init/refresh
			$this.bind('refresh' + '.' + this.widgetName, function(ev, ui) {
					self.refreshSlot(i);
					self.setPosition(i, self.slots[i].middleOffset - (self.slots[i].listLiHeight * self.slots[i].selectedLi)); // set position to selectedLi adjusted to be on the middle.

					// update select val if necessary
					if(!empty(self.slots[i].select)) {
						self.slots[i].select.val('');
					}

					console.log('$.ui.' + self.widgetName + ' ~ ' + 'refresh()', [i, self.slots[i]]);

					ev.preventDefault();
					ev.stopPropagation();
					return true;
			}).trigger('refresh');

			// resize if size has been specified by options or from input
			if(o.size && o.size != self.slots[i].elementHeight) {
				self.element.css({height : self.slots[i].elementHeight});
				$this.trigger('refresh');
			}

		});

		// global refresh trigger
		this.element.bind('refresh' + '.' + this.widgetName, function(ev, ui) {
			$.each(self.slots, function(i) {
				self.slots[i].list.trigger('refresh');
			});

			ev.preventDefault();
			ev.stopPropagation();
			return true;
		});

		// insert frame
		if (o.frame) this.frame = $('<div>').addClass(self.widgetBaseClass + '-frame').appendTo(this.element);

		// mouse click
		this.element.data("selectwheel", this).bind('click.'+this.widgetName, this._mouseClick);

		// mouse init
		this._mouseInit();

		// create event
		if($.isFunction(o.create)) this.element.bind('create' + '.' + this.widgetName, o.create).trigger('create');

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

function empty (mixed_var) {
    if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') return true;
    if (typeof mixed_var == 'object') {
        for (var key in mixed_var) return false;
        return true;
    }
    return false;
}

})(jQuery, window.console);
