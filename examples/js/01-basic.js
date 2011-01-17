 (function($) {

	if(!window.console) window.console = {};

	$(function() {

		console.log('$(document).load()');

		$(window).load(function() {

			console.log('$(window).load()');

			$(".ui-trigger-selectwheel").eq(0).selectwheel({'wrap' : true, 'target' : "select", 'debug' : true});

			$(".ui-trigger-selectwheel").eq(1).selectwheel({'target' : "ul", 'debug': true});

		});

	});

})(jQuery);