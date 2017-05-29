$(document).ready(function() {
	var longtext = $(".eventitem.mobile .description").text();
	if (longtext.length > 120){

		longtext = longtext.substring(0,120);
		$(".eventitem.mobile .description").html(longtext + "&hellip;");
	}
});
