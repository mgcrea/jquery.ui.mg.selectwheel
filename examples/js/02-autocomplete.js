 (function($) {

	if(!window.console) window.console = {};

	$(function() {

		console.log('$(document).load()');

		$(window).load(function() {

			console.log('$(window).load()');

			var availableTags = [
				"ActionScript",
				"AppleScript",
				"Asp",
				"BASIC",
				"C",
				"C++",
				"Clojure",
				"COBOL",
				"ColdFusion",
				"Erlang",
				"Fortran",
				"Groovy",
				"Haskell",
				"Java",
				"JavaScript",
				"Lisp",
				"Perl",
				"PHP",
				"Python",
				"Ruby",
				"Scala",
				"Scheme"
			];

			$("#search").autocomplete({
				source: availableTags,
				appendTo: "#ui-autocomplete-results",
				open: function( event, ui ) {
					console.log("$.ui.autocomplete.open()", event, ui);
					$(".ui-trigger-selectwheel").trigger("refresh");
					//$( "#PagesSearch" ).val( ui.item.value.toUpperCase() );
					return false;
				},
				focus: function( event, ui ) {
					console.log("$.ui.autocomplete.focus()", event, ui);
					//$( "#PagesSearch" ).val( ui.item.value.toUpperCase() );
					return false;
				},
				select: function( event, ui ) {
					console.log("$.ui.autocomplete.select()", event, ui);
					$("#search").val(ui.item.value.toUpperCase());
					//$( "#project-id" ).val( ui.item.value );
					//$( "#project-description" ).html( ui.item.desc );
					//$( "#project-icon" ).attr( "src", "images/" + ui.item.icon );

					return false;
				},
				change: function( event, ui ) {
					console.log("$.ui.autocomplete.change()", event, ui);
					//$( "#PagesSearch" ).val( ui.item.value.toUpperCase() );
					return false;
				}
			});

			$(".ui-trigger-selectwheel").selectwheel({
				'wrap' : false,
				'frame' : true,
				'target' : "ul",
				'select' : function(ev, ui) {
					console.log('$.ui.selectwheel.select()', [ev, ui]);
					setTimeout(function() {
						$(ev.target).find('a').trigger('mouseenter').trigger('click');
					}, 150);
				},
				'debug' : true
			});

			//$(".ui-trigger-selectwheel").eq(1).selectwheel({'target' : "ul", 'debug': true});

		});

	});

})(jQuery);