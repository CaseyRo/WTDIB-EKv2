<?php

class jsonfile
{
	private $contents = array();
	private $jaartal;
	private $maand;

	public function setJSONcontent($contents){
		$len = count($this->contents);
		$this->contents[$len] = $contents;
		//echo $len;
	}

	public function setJaartal($jaartal){
		$this->jaartal = $jaartal;
	}

	public function setMaand($maand){
		$this->maand = $maand;
	}

	public function getJaartal(){
		return $this->jaartal;
	}

	public function getMaand(){
		return $this->maand;
	}
	
	public function getJSONcontent(){
		return $this->contents;
	}
}

?>