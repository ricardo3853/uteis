<?php 
			$prioridade = get_post_meta( $post->ID, 'prioridade', true );
			?>
		<div class="postmeta updated color_gray">
		      <div class="postdate bg-lightgray headerfont" itemprop="datePublished">
		      <span class="postday"><?php echo $prioridade;?> </span>
		      
		    </div>
		</div>