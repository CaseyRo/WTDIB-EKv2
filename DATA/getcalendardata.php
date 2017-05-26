<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$file = $_GET['calendarURL'];
//$file = 'http://www.webcal.fi/cal.php?id=75&format=json&start_year=previous_year&end_year=2022&tz=Europe%2FBerlin';
$newfile = 'holidays.json';
//print $file;

$date = time();
$oldfiledate = filemtime($newfile);
//print $oldfiledate . " " . $date . "<br/>";
$interval = $date - $oldfiledate;

//print $interval;
if ($interval > 60*60*24*7){
	if (!copy($file, $newfile)) {
		$output = "copy of holidays failed";
	}
	else{
		$output = "created new holidays json";
	}
}
else{
	$output = "using cached file";
}

echo $output;
//readfile($newfile);
?>