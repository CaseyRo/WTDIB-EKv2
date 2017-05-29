var now = moment();
var currmonth = now.clone();
var frontcardheight = 0;
var rearcardheight = 0;

$(document).ready(function() {
	getCalendarData(now.format("MM"),now.format("YYYY"));
	
	
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip();
	});

	$(".eventitem").click(function(){
		$('.large-modal').modal('show');
	});

	$(".month").click(function(){
		currmonth = now.clone();
		$( ".daypicker" )
			.addClass("flipped");
		$(".daypicker").clone().appendTo('.eventkalender').removeClass("flipped").addClass("flippedback");
		setTimeout(function(){
		  setCalendar(now.format("MM"),now.format("YYYY"));
		  $(".daypicker.flippedback").removeClass('flippedback');
		  $('.daypicker.flipped').remove();
		}, 200);
		
	});

	$("div[class*='box navigation']").click(function(){
		
		classname = $(this).attr('class').slice(-1);
		if (classname == 2){
			currmonth.add(1,"month");
			
			$( ".daypicker" )
				.addClass("flipped");
			$(".daypicker").clone().appendTo('.eventkalender').removeClass("flipped").addClass("flippedback");
			setTimeout(function(){
			  setCalendar(currmonth.format("MM"),currmonth.format("YYYY"));
			  $(".daypicker.flippedback").removeClass('flippedback');
			  $('.daypicker.flipped').remove();
			}, 200);
		}
		if (classname == 1){
			currmonth.subtract(1,"month");
			

			$( ".daypicker" )
				.addClass("flippedback");
			$(".daypicker").clone().appendTo('.eventkalender').removeClass("flippedback").addClass("flipped");
			setTimeout(function(){
			  setCalendar(currmonth.format("MM"),currmonth.format("YYYY"));
			  $(".daypicker.flipped").removeClass('flipped');
			  $('.daypicker.flippedback').remove();
			}, 200);
		}
	});

	$(".eventdetails .navigation .btn").click(function(){
		if ($(this).text() != "Terug")
		{
			var src = 'https://maps.googleapis.com/maps/api/staticmap?center=Brunnenstraße+53,+13355+Berlin,+Germany&zoom=13&maptype=roadmap&markers=Brunnenstraße+53,+13355+Berlin,+Germany&key=AIzaSyDuKiZv44jf9yvpFjamLW3gnJfetfEG7ts';
			var srcsizewidth = $(".card__front").width();
			var srcsizeheight = 200;
			var size = srcsizewidth + "x" + srcsizeheight;
			src = src + "&size=" + size;
			$(".card__back .smallcontentback img").attr('src',src);
			$(this).text("Terug");
			$(".card__front").addClass("flipped");
			$(".card__front").addClass("lowzindex");
			$(".card__back").addClass("fullopacity");
			growModal();
			$(".card__front").height(rearcardheight);
		}
		else
		{
			$(".card__front").removeClass("flipped");
			$(".card__back").removeClass("fullopacity");
			$(".card__front").removeClass("lowzindex");
			$(this).text("meer informatie");
			$(".card__front").height(frontcardheight);
		}
	});

	console.timeEnd("calendarReadAndStore");
});

function setCalendar(month,year){ /*sets the calendar up correctly*/
	if (!month){
		moment.locale('nl');
		month = now.format("MM");
		year = now.format("YYYY");
	}
	var noone,row=1;
	var newDate = moment(month+"-"+year,"MM-YYYY");
	var lastdayoldmonth = newDate.clone().startOf("month");
	var monthBox = newDate.format("MMMM YYYY");
	monthBox = monthBox.substr(0,1)
		.toUpperCase()+monthBox.substr(1);
	$("div[class*='day']")
		.removeClass("today")
		.removeClass("newMonth")
		.data("datum","")
		.removeClass("oldMonth");
	$(".month").text(monthBox);

	lastDay = newDate.clone().endOf("month");
	firstDay = newDate.clone().startOf("month");

	$("div[class*='weekdaydisplay']").each(function(index){
		var classname = $(this).attr('class');
		classname = classname.slice(-1);
		if (classname == firstDay.format("E")) 
		{
			noone = parseInt(classname);
			//console.log(now.format("MM-YYYY") + " " + newDate.format("MM-YYYY"));
		}
	});
	for (var i = noone-1; i >=1; i--){ /*lets go and setup the days of the previous month*/
		$("div[class*='day1"+i+"']").text(lastdayoldmonth.subtract(1,"day").format("DD"))
		.addClass("oldMonth")
		.data("datum",lastdayoldmonth.clone());
	}
	for (i =  1; i <= parseInt(lastDay.format("D")); i++) { 		/*lets set up the calendar shall we?*/
		if (i == now.format("DD")){ 									/*looks for today*/
			if (now.format("MM-YYYY") == newDate.format("MM-YYYY")){ 	/*looks for THIs day*/
				$("div[class*='day"+row+noone+"']").addClass("today");
			}
		}
		currentmonthday = moment(i+"-"+newDate.format("MM-YYYY"),"D-MM-YYYY");
		$("div[class*='day"+row+noone+"']")
			.text(i)
			.data("datum",currentmonthday);
		if (noone == 7){noone=0;row++;}
		noone++;
	}
	var nextone = parseInt(row.toString() + noone.toString());
	//console.log(nextone);
	for (i = 1; i<=68-nextone; i++){
		nextmonthday = moment(i+"-"+newDate.clone().add(1,"month").format("MM-YYYY"),"D-MM-YYYY");
		$("div[class*='day"+row+noone+"']")
			.text(i)
			.data("datum",nextmonthday)
			.addClass("newMonth");
		if (noone == 7){noone=0;row++;}
		noone++;
	}	

}

function getCalendarData(month,year){
	newDate = moment(month+"-"+year,"MM-YYYY");
	$.get('DATA/'+year+'/'+month+'.json',function(data)
	{
		
	})
	.done(function(data){
		//console.log(data);
		
	});

}

function growModal(){
	console.log($(".eventitem").height() + " " + $(".card__front").height() + " " + $(".card__back").height());
	if (frontcardheight === 0) {frontcardheight = $(".card__front").height();}
	if (rearcardheight === 0) {rearcardheight = $(".card__back").height()+50;}
}