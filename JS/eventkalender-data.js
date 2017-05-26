var calendarJSONURL = "http://www.webcal.fi/cal.php?id=75&format=json&start_year=previous_year&end_year=2022&tz=Europe%2FBerlin"; // get a holidays URL to use in the calendar
var yearsAhead = 1; // how much years should we think in the future?
var now = moment();
var endInYears = now.clone().add(yearsAhead,'years');
var eventobjects = [], holidays = [];

$(document).ready(function() 
{
	getHolidays();
	openData();
	
	//console.log(eventobjects);
});

function getCalendarData(){
	
	$.get('DATA/events.csv',function(data)
	{
		
	})
	.done(function(data){

		eventobjects = $.csv.toObjects(data);
		console.log(eventobjects.length + " events after first load");
		//console.log(eventobjects);
		checkDoubleEvents(eventobjects);
		checkYearlyEvents(eventobjects);
		checkMonthlyEvents(eventobjects);
		checkWeeklyEvents(eventobjects);
		createHolidays(holidays);
		store(eventobjects);
		console.timeEnd("calendarReadAndStore");
		//console.log(data);
		//alert('done');
	});
}

function getHolidays(){
	$.ajax({
		url: 'DATA/getcalendardata.php',
		data: {calendarURL: calendarJSONURL}
	})
	.done(function(data){
		console.log("php response: \n" + data);
		console.log("successfully copied holidays");
		parseHolidays();
	})
	.fail(function(){
		alert("error in importing holidays");
	});
}

function parseHolidays(){
	$.getJSON("DATA/holidays.json", function(json) {
		holidays = json;
		$.each(holidays, function(i,val){
			var tempdata = moment(val.date);
			holidays[i].date = tempdata.format("DD/MM/YYYY");
		});
		console.log("successfully parsed holidays");
	});
}

function openData(){
	$.ajax({
		url: "DATA/copy.php"
	})
	.done(function(data){
		console.log("php response: \n" + data);
		console.log("successfully copied events");
		//document.write(data);
		getCalendarData();
	})
	.fail(function(){
		alert("error in getting events");
	});
}

function store(eventobjects){
	var dataJSON = JSON.stringify(eventobjects);
	$.ajax({
		type: "POST",
		url: "DATA/store.php",
		processData: false,
		contentType: 'application/json',
		data: dataJSON
	})
	.done(function(data){
		//document.write(data);
		//console.log(data);
		console.log("successfully stored events in cache");
	})
	.fail(function(){
		alert("error");
	});
}

function checkWeeklyEvents(eventobjects){
	$.each(eventobjects, function(i,val){
		if (val["Terugkerend?"] == "Wekelijks (ook op feestdagen)"){
			pushNewEvent(val,yearsAhead*52,"W",true);
		}
		if (val["Terugkerend?"] == "Wekelijks (niet op feestdagen)"){
			pushNewEvent(val,yearsAhead*52,"W",false);
		}
	});

	console.log(eventobjects.length + " events after weekly check");
}

function checkMonthlyEvents(eventobjects){
	$.each(eventobjects, function(i,val){
		if (val["Terugkerend?"] == "Maandelijks (ook op feestdagen)"){

			pushNewEvent(val,yearsAhead*12,"M",true);
		}
		if (val["Terugkerend?"] == "Maandelijks (niet op feestdagen)"){
			pushNewEvent(val,yearsAhead*12,"M",false);
		}
	});

	console.log(eventobjects.length + " events after monthly check");
}

function checkYearlyEvents(eventobjects){
	// console.log(eventobjects);
	$.each(eventobjects, function(i,val){
		if (val["Terugkerend?"] == "Jaarlijks (ook op feestdagen)"){

			pushNewEvent(val,yearsAhead,"Y",true);
		}
		if (val["Terugkerend?"] == "Jaarlijks (niet op feestdagen)"){
			pushNewEvent(val,yearsAhead,"Y",false);
		}
	});
 
	console.log(eventobjects.length + " events after yearly check");
}

function checkDoubleEvents(eventobjects){
	var newEndDate, newStartDate, toremoveitems = [], tempEvent = [];
	var i2, eventstoaddcounter=0;
	$.each(eventobjects, function(i,val){
		var startDate = moment(val.Startdatum,"DD/MM/YYYY");
		var endDate = moment(val.Einddatum,"DD/MM/YYYY");
		var startMonth = startDate.month() +1;
		var endMonth = endDate.month() +1;
		var startYear = startDate.year();
		var endYear = endDate.year();
		if (endYear > startYear){ // if the event ends in a new year, we have a difference in months that we need to readdress
			
			toremoveitems.push(i);
			startDateEvent = jQuery.extend(true,{},val); // creates an event with the startdate defined, until EOM
			startDateEvent.Einddatum = startDate.endOf('month').format("DD/MM/YYYY");
			eventobjects.push(startDateEvent);
			eventstoaddcounter++;
			for (i2 = 1; i2<endDate.diff(startDate,"months",true); i2++){ // sets up an additional event to save with 'full months'
				tempEvent = [];
				tempEvent[i2] = jQuery.extend(true,{},val);
				newStartDate = startDate.clone().add(i2-1,'months').startOf('month');
				newEndDate = startDate.clone().add(i2-1,'months').endOf('month');
				//console.log(startDate.format("DD/MM/YYYY") + " " + newStartDate.format("DD/MM/YYYY") + " " + newEndDate.format("DD/MM/YYYY"));
				tempEvent[i2].Startdatum = newStartDate.format("DD/MM/YYYY");
				tempEvent[i2].Einddatum = newEndDate.format("DD/MM/YYYY");
				console.log(tempEvent[i2]);
				eventobjects.push(tempEvent[i2]);
				eventstoaddcounter++;
			}
			endDateEvent = jQuery.extend(true,{},val); // creates an event with the enddate defined, starting Beginning Of Month
			endDateEvent.Startdatum = endDate.startOf('month').format("DD/MM/YYYY");
			eventobjects.push(endDateEvent);
			eventstoaddcounter++;
		}
		else{
			if (endMonth > startMonth){
				toremoveitems.push(i);
				startDateEvent = jQuery.extend(true,{},val); // creates an event with the startdate defined, until EOM
				startDateEvent.Einddatum = startDate.endOf('month').format("DD/MM/YYYY");
				eventobjects.push(startDateEvent);
				eventstoaddcounter++;
				for (i2 = 2; i2<=endMonth-startMonth; i2++){ // sets up an additional event to save with 'full months'
					tempEvent = [];
					tempEvent[i2] = jQuery.extend(true,{},val);
					newStartDate = startDate.clone().add(i2-1,'months').startOf('month');
					newEndDate = startDate.clone().add(i2-1,'months').endOf('month');
					tempEvent[i2].Startdatum = newStartDate.format("DD/MM/YYYY");
					tempEvent[i2].Einddatum = newEndDate.format("DD/MM/YYYY");
					eventobjects.push(tempEvent[i2]);
					eventstoaddcounter++;
				}
				endDateEvent = jQuery.extend(true,{},val); // creates an event with the enddate defined, starting Beginning Of Month
				endDateEvent.Startdatum = endDate.startOf('month').format("DD/MM/YYYY");
				eventobjects.push(endDateEvent);
				eventstoaddcounter++;
			}
		}
		
	});
	toremoveitems.reverse(); // invert the array so we don't get a messy removal of items
	$.each(toremoveitems, function(i,val){
		eventobjects.splice(val,1);
	});
	console.log(eventobjects.length + " events after check for events ("+eventstoaddcounter+"-"+toremoveitems.length+") starting in a different month than ending");
	//console.log(eventobjects);
}

function pushNewEvent(Event,diff,timeIndication,specialHolidays){
	var tempevent,newStartDate,newEndDate,skipcreation;
	var oldStartDate = moment(Event.Startdatum,"DD/MM/YYYY");
	var oldEndDate = moment(Event.Einddatum,"DD/MM/YYYY");

	if (timeIndication == "Y"){
		var yearsBefore = now.diff(oldStartDate,'years');
		for (noYears = 1; noYears<=diff+yearsBefore; noYears++){
			tempEvent = jQuery.extend(true,{},Event);
			newStartDate = oldStartDate.clone().add(noYears,'y');
			newEndDate = oldEndDate.clone().add(noYears,'y');
			tempEvent.origStartDate = oldStartDate.format("DD/MM/YYYY");
			tempEvent.origEndDate = oldEndDate.format("DD/MM/YYYY");
			tempEvent.Startdatum = newStartDate.format("DD/MM/YYYY");
			tempEvent.Einddatum = newEndDate.format("DD/MM/YYYY");
			tempEvent.hash = createHash(newStartDate.format("DD/MM/YYYY"),newEndDate.format("DD/MM/YYYY"),tempEvent.Titel);
			skipcreation = false;
			if (specialHolidays === false){
				skipcreation = compareToHolidays(newStartDate);
				console.log("special holidays");
			}
			if (skipcreation === false)
			{
				eventobjects.push(tempEvent);
			}
		}
	}
	if (timeIndication == "M"){
		var monthsBefore = now.diff(oldStartDate,'months');
		for (noMonths = 1; noMonths <= diff+monthsBefore; noMonths++){
			tempEvent = jQuery.extend(true,{},Event);
			newStartDate = oldStartDate.clone().add(noMonths,'M');
			newEndDate = oldEndDate.clone().add(noMonths,'M');
			tempEvent.origStartDate = oldStartDate.format("DD/MM/YYYY");
			tempEvent.origEndDate = oldEndDate.format("DD/MM/YYYY");
			tempEvent.Startdatum = newStartDate.format("DD/MM/YYYY");
			tempEvent.Einddatum = newEndDate.format("DD/MM/YYYY");
			tempEvent.hash = createHash(newStartDate.format("DD/MM/YYYY"),newEndDate.format("DD/MM/YYYY"),tempEvent.Titel);
			skipcreation = false;
			if (specialHolidays === false){
				skipcreation = compareToHolidays(newStartDate);
				console.log("special holidays");
			}
			if (skipcreation === false)
			{
				eventobjects.push(tempEvent);
			}
		}
	}
	if (timeIndication == "W"){

		var weeksBefore = now.diff(oldStartDate,'weeks');
		for (noWeeks = 1; noWeeks<=diff+weeksBefore; noWeeks++){
			tempEvent = jQuery.extend(true,{},Event);
			newStartDate = oldStartDate.clone().add(noWeeks,'w');
			newEndDate = oldEndDate.clone().add(noWeeks,'w');
			tempEvent.origStartDate = oldStartDate.format("DD/MM/YYYY");
			tempEvent.origEndDate = oldEndDate.format("DD/MM/YYYY");
			tempEvent.Startdatum = newStartDate.format("DD/MM/YYYY");
			tempEvent.Einddatum = newEndDate.format("DD/MM/YYYY");
			tempEvent.hash = createHash(newStartDate.format("DD/MM/YYYY"),newEndDate.format("DD/MM/YYYY"),tempEvent.Titel);
			skipcreation = false;
			if (specialHolidays === false){
				skipcreation = compareToHolidays(newStartDate);
				console.log("special holidays");
			}
			if (skipcreation === false)
			{
				eventobjects.push(tempEvent);
			}
		}
	}
}

function compareToHolidays(newStartDate){
	$.each(holidays, function(i,val){
		var checkHoliday = moment(val.date,"DD/MM/YYYY");
		//console.log (checkHoliday + " " + newStartDate);
		if (checkHoliday == newStartDate){
			console.log (tempEvent.titel + " is on a holiday! -- " + val.name);
			skipcreation = true;
		}
		else
		{
			skipcreation = false;
		}
	});
	return skipcreation;
}

function createHash(startDate,endDate,title)
{
	//console.log(startDate + "_" + endDate + "_" + encodeURI(title));
	return startDate + "_" + endDate + "_" + encodeURI(title);
}

function createHolidays(holidays){
	$.each(holidays, function(i,val){
		var checkHoliday = [];
		var a = moment(val.date,"DD/MM/YYYY");
		var b = moment();
		var diff = (a.diff(b,'years'));
		if (diff < yearsAhead){
			checkHoliday = {
				Startdatum : val.date,
				Einddatum : val.date,
				Omschrijving: val.description + "("+val.age+" jaar oud)",
				Titel: val.name,
				WebURL: val.url,
				Categoriën: "WTDIB special",
				"URL omschrijving": "Meer informatie over: \'"+ val.name + "\'"};
			if (!val.age){
				checkHoliday.Omschrijving = val.description;
			}
			checkHoliday.hash = createHash(val.date,val.date,val.name);
			eventobjects.push(checkHoliday);
			//console.log(checkHoliday);
		}		
		
	});
	console.log(eventobjects.length + " events after adding public holidays");
}

