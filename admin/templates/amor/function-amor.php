$amor = new Create_Admin_tela();
		$curso->single_name="amor";
		$curso->plural_name="amors";	
		$curso->support = array('title','editor','thumbnail');
		$curso->menu_icons="dashicons-megaphone";
		$dados=array("Importante"=>"Importante","Normal"=>"Normal","Aviso"=>"Aviso");
		$fieldsCurso=array(
			array('id'=>'amor_link',
				  'title'=>'Link',
				  'object_type'=>'input',
				  'type'=>'url',
				  'context'=>'side',
				  'priority'=>'high',
				  'filter'=>false ),			
			array('id'=>'amor_prioridade',
				'title'=>'Prioridade',
				'object_type'=>'select',
				'type'=>'select',
				'data'=>$dados,
				'context'=>'side',
				'filter'=>true,
				'priority'=>'high'),		
		);