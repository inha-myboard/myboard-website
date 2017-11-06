

$(document).on("ready", function(){
	$('.grid-stack').gridstack();
	var gridstack = $('.grid-stack').data("gridstack");
	$("#editButton").on("click", function(){
		gridstack.movable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
		gridstack.resizable(gridstack.container.children('.' + gridstack.opts.itemClass), true);
		$(".nav-edit", "ul.nav").show();
		$(".nav-normal", "ul.nav").hide();
	});
	$("#exitButton").on("click", function(){
		gridstack.disable();
		$(".nav-edit", "ul.nav").hide();
		$(".nav-normal", "ul.nav").show();
	});
	$("#saveButton").on("click", function(){
		// Save Action
	});
});