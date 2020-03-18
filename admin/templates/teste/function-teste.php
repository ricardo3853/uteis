<?php 

$teste = new Create_Admin_tela();
		$teste->single_name="teste";
		$teste->plural_name="testes";	
		$teste->support = array('title','editor','thumbnail');
		$teste->menu_icons="dashicons-megaphone";
		$dados=array("Importante"=>"Importante","Normal"=>"Normal","Aviso"=>"Aviso");
		$fieldsteste=array(
			array('id'=>'teste_link',
				  'title'=>'Link',
				  'object_type'=>'input',
				  'type'=>'url',
				  'context'=>'side',
				  'priority'=>'high',
				  'filter'=>false ),			
			array('id'=>'teste_prioridade',
				'title'=>'Prioridade',
				'object_type'=>'select',
				'type'=>'select',
				'data'=>$dados,
				'context'=>'side',
				'filter'=>true,
				'priority'=>'high'),		
		); 
$teste->createCP();