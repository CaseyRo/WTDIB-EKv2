<?php
	

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	include 'jsonfile.php';

	
	//$request_body = var_dump($HTTP_RAW_POST_DATA);
	if (file_get_contents('php://input')){
		$data = file_get_contents('php://input');
		$dataJSON = json_decode($data);
	}
	
	

	//echo $data;
	

	// remove all previously created files, just in case
	for ($i=2000; $i < 2099; $i++) { 
		if (is_dir($i)){
			array_map('unlink', glob("$i/*.*"));
			rmdir($i);
		}
	}

	// end of removal

	

	//$filename = $jaartal.'/'.$maand.'.json';
	$filename = '';
	$jsonfile = array();
	
	$jsonfile[]=new jsonfile();

	/*$jsonfile[$jaartal.$maand]->setJSONcontent('test');
	echo $jsonfile[$jaartal.$maand]->getJSONcontent();
	*/
	//echo $filename;

	if (isset($dataJSON)){
		foreach ($dataJSON as $item) {
			$date = DateTime::createFromFormat('d/m/Y', $item->Startdatum);
			$jaartal = $date->format('Y');
			$maand = $date->format('m');

			if (!array_key_exists($jaartal.$maand, $jsonfile)){
				$jsonfile[$jaartal.$maand]=new jsonfile();
				$jsonfile[$jaartal.$maand]->setJaartal($jaartal);
				$jsonfile[$jaartal.$maand]->setMaand($maand);

				//echo $jaartal.$maand;
			}
			//$jsonfile[$jaartal.$maand]->setJSONcontent('test');

			$jsonfile[$jaartal.$maand]->setJSONcontent($item);
		}
		foreach ($jsonfile as $key => $value) {
		    //echo $key . ", " . $jsonfile[$key]->getJaartal() . "--" . $jsonfile[$key]->getMaand() . "<br/>";
		    if ($key != 0)
		    {
		    	$jaartal = $jsonfile[$key]->getJaartal();
		    	$maand = $jsonfile[$key]->getMaand();
		    	$filecontent = $jsonfile[$key]->getJSONcontent();
		    	if (!file_exists($jaartal)) {
		    	    mkdir($jaartal, 0777, true);
		    	}
		    	$filename = $jaartal.'/'.$maand.'.json';
		    	$data = json_encode($filecontent);
		    	$file = fopen($filename,'w');
		    	fwrite($file, $data);
		    	fclose($file);
		    	if (file_exists($filename)){
		    		echo $filename . "-->";
		    		echo "file exists"."<br/>";
		    	}else{
		    		echo "doesnt exist<br/>";
		    	}
		    }
		}
	}
	

	

	/*
	$data = json_encode($test);
	$file = fopen('test.json','w');
	fwrite($file, $data);
	fclose($file);
	*/

	//$file = 'test.txt';
	// Öffnet die Datei, um den vorhandenen Inhalt zu laden
	// Fügt eine neue Person zur Datei hinzu
	// Schreibt den Inhalt in die Datei zurück
	//file_put_contents($file, $data);

	
?>
