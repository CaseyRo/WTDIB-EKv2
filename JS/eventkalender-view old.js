var now = moment();

$(document).ready(function() {
	getCalendarData(now.format("MM"),now.format("YYYY"));
	console.timeEnd("calendarReadAndStore");
	
});


function getCalendarData(month,year){
	newDate = moment(month+"-"+year,"MM-YYYY");
	$.get('DATA/'+year+'/'+month+'.json',function(data)
	{
		
	})
	.done(function(data){
		//console.log(data);
		document.body.innerHTML = "";
		document.write('<table border=1>');
		document.write('<tr><td colspan="4" style="text-align:center">'+month+" "+year+"</td></tr>");
		document.write('<tr><td rowspan="'+data.length+'" class="prevbtn">Vorige</td>');
		$.each(data,function(i,val){
			//console.log (i,val.Titel)
			document.write('<td>'+i+'</td><td>'+val.Titel+'</td><td>'+val.Startdatum+'</td></tr><tr>');
		});
		document.write('</tr>');
		document.write('<tr><td rowspan="'+data.length+'" class="nextbtn">Volgende</td>');
		document.write('</table>');

		$(".prevbtn").click(function(){
			getCalendarData(newDate.clone().subtract(1,'month').format('MM'),newDate.clone().subtract(1,'month').format('YYYY'));
		});
		$(".nextbtn").click(function(){
			getCalendarData(newDate.clone().add(1,'month').format('MM'),newDate.clone().add(1,'month').format('YYYY'));
		});
	});

}