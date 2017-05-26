<?php
$file = 'https://docs.google.com/spreadsheets/d/1g1pGG3YWP3yUKA1Zls6VNOWWF9Tjm_DduYpgEOtC0YA/pub?gid=0&single=true&output=csv';
$newfile = 'events.csv';

if (!copy($file, $newfile)) {
    echo "copy of document failed";
}
else{
	echo "completed CSV creation";
}

?>