var myArgs = process.argv.slice(2);
let name = myArgs[0];

let admin = './admin';
let theme = './theme';
let template = './admin/templates';
let categoria = './admin/templates/'+name;

var fs = require('fs');
 
 
if (!fs.existsSync(admin)){
    fs.mkdirSync(admin);
    fs.mkdirSync(template);
    fs.mkdirSync(categoria);
    
}else{
	if (!fs.existsSync(template)){
		fs.mkdirSync(template);	
		fs.mkdirSync(categoria);
	}else{
		if (!fs.existsSync(categoria)) fs.mkdirSync(categoria);
		}
}
 

if (!fs.existsSync(theme)){
    fs.mkdirSync(theme);
}

function page(name,path){

	comentario="<?php "+"\n";
	comentario+="/*"+"Template Name: "+name+" */";
	comentario+= "\n"+ "/*page template para o custom post type  - é a primeira página fica na raiz do child ou tema*/"+"\n\n";
	comentario+="get_template_part( 'admin/templates/"+name+"/loop'); ?>";
	createFile(path+"/page-"+name+'.php',comentario);
}
function single(name,path){

	let retorno= `<?php 
		 global $virtue_sidebar;
		if( virtue_display_sidebar() ) {
			$virtue_sidebar = true;
		} else {
			$virtue_sidebar = false;
		}
		do_action( 'virtue_single_post_begin' ); 
		?>
		<div id="content" class="container">
			<div class="row single-article" itemscope itemtype="https://schema.org/BlogPosting">
				<div class="main <?php echo esc_attr( virtue_main_class() ); ?>" role="main">
				<?php while ( have_posts() ) : the_post();

				do_action( 'virtue_single_post_before' ); 

				?>
					<article <?php post_class(); ?>>
					<?php
					/**
					* @hooked virtue_single_post_headcontent - 10
					* @hooked virtue_single_post_meta_date - 20
					*/
					do_action( 'virtue_single_post_before_header' );
					?>
						<header>

						<?php 
						/**
						* @hooked virtue_post_header_title - 20
						* @hooked virtue_post_header_meta - 30
						*/
						do_action( 'virtue_single_post_header' );
						?>
						
						</header>

						<div class="entry-content" itemprop="articleBody">
							<?php
							do_action( 'virtue_single_post_content_before' );
		                        $link  = get_post_meta( $post->ID, 'link', true );
		                        echo $link;
								//the_content(); 
		                      
							do_action( 'virtue_single_post_content_after' );
							?>
						</div>

						<footer class="single-footer">
						<?php 
							/**
							* @hooked virtue_post_footer_pagination - 10
							* @hooked virtue_post_footer_tags - 20
							* @hooked virtue_post_footer_meta - 30
							* @hooked virtue_post_nav - 40
							*/
							do_action( 'virtue_single_post_footer' );
							?>
						</footer>
					</article>
					<?php
					/**
					* @hooked virtue_post_authorbox - 20
					* @hooked virtue_post_bottom_carousel - 30
					* @hooked virtue_post_comments - 40
					*/
					do_action( 'virtue_single_post_after' );
					
					endwhile; ?>
				</div>
				<?php 
				do_action( 'virtue_single_post_end' );`;
				createFile(path +"/single-"+name+'.php',retorno);
}

function loop(name,path){
	let retorno= `<?php
		/*
		Template Name: `+name+`
		*/
		 global $post, $virtue_sidebar;

		if( virtue_display_sidebar() ) {
			$virtue_sidebar = true;
			$fullclass 		 = '';
		} else {
			$virtue_sidebar = false;
			$fullclass = 'fullwidth';
		}
		if( get_post_meta( $post->ID, '_kad_blog_summery', true ) == 'full' ) {
			$summery 	= 'full';
			$postclass 	= "single-article fullpost";
		} else {
			$summery 	= 'normal';
			$postclass  = 'postlist';
		}
		$blog_category 	= get_post_meta( $post->ID, '_kad_blog_cat', true );
		$blog_items 	= get_post_meta( $post->ID, '_kad_blog_items', true ); 
		if( $blog_category == '-1' || $blog_category == '' ) {
			$blog_cat_slug = '';
		} else {
			$blog_cat = get_term_by ( 'id',$blog_category,'category' );
			$blog_cat_slug = $blog_cat -> slug;
		}
		if( $blog_items == 'all' ) {
			$blog_items = '-1';
		} 
			/**
			* @hooked virtue_page_title - 20
			*/
			do_action( 'virtue_page_title_container' );
			?>
			
			<div id="content" class="container <?php echo esc_attr( virtue_container_class() ); ?>">
				<div class="row">
					<div class="main <?php echo esc_attr( virtue_main_class() );?> <?php echo esc_attr( $postclass ) .' '. esc_attr( $fullclass ); ?>" role="main">
						<?php 	
						$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
						$temp = $wp_query; 
						$wp_query = null; 
						$wp_query = new WP_Query();
						$wp_query->query( array(				 
							'post_type'	 => '`+name+`' 
							)
						);
		   			 //$loop = new WP_Query( array( 'post_type' => '`+name+`' ) );
						if ( $wp_query ) : 
							while ( $wp_query->have_posts() ) : $wp_query->the_post();
						 		if( $summery == 'full' ) {
										get_template_part( 'admin/templates/`+name+`/content', 'fullpost' ); 
								} else {
										get_template_part( 'admin/templates/`+name+`/content', get_post_format() ); 
								}
							endwhile; 
						else: ?>
							<div class="error-not-found"><?php esc_html_e( 'Sorry, no blog entries found.', 'virtue' ); ?></div>
						<?php endif; 

						/**
						* @hooked virtue_pagination - 10
						*/
						do_action( 'virtue_pagination' );

						$wp_query = $temp;  // Reset 
						wp_reset_postdata();

						/**
		                * @hooked virtue_page_comments - 20
		                */
						do_action( 'virtue_page_footer' );
						?>
					</div><!-- /.main -->
			`;

			createFile(path+"/loop.php",retorno);
}

function prioridade(path){

 	re = `<?php 
			$prioridade = get_post_meta( $post->ID, 'prioridade', true );
			?>
		<div class="postmeta updated color_gray">
		      <div class="postdate bg-lightgray headerfont" itemprop="datePublished">
		      <span class="postday"><?php echo $prioridade;?> </span>
		      
		    </div>
		</div>`;
		createFile(path+"/prioridade.php",re);
 }

function content(name,path){
	conteudo=`<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> itemscope="" itemtype="https://schema.org/BlogPosting">
        <div class="row">
        <?php global $post, $virtue, $virtue_sidebar; 
           
            $height       = get_post_meta( $post->ID, '_kad_posthead_height', true );
            $swidth       = get_post_meta( $post->ID, '_kad_posthead_width', true );

            $postsummery = 'img_portrait';

            if (!empty($height)){
                $slideheight = $height;
            } else {
                $slideheight = apply_filters('kt_post_excerpt_image_height', 400);
            }
            if (!empty($swidth)){
                $slidewidth = $swidth;
            } else {
            	if( $virtue_sidebar ) {
                	$slidewidth = apply_filters('kt_post_excerpt_image_width', 846);
                } else {
                	$slidewidth = apply_filters('kt_post_excerpt_full_image_width', 1140);
                }
            }
            if(empty($postsummery) || $postsummery == 'default') {
                if(!empty($virtue['post_summery_default'])) {
                    $postsummery = $virtue['post_summery_default'];
                } else {
                    $postsummery = 'img_portrait';
                }
            }
            $portraitwidth = apply_filters('kt_post_excerpt_image_width_portrait', 365);
            $portraitheight = apply_filters('kt_post_excerpt_image_height_portrait', 365);
                        
            if($postsummery == 'img_landscape') { 
                $textsize = 'col-md-12'; 
                	$image_id = get_post_thumbnail_id( $post->ID );
                	$img = virtue_get_image_array( $slidewidth, $slideheight, true, 'iconhover', null, $image_id, true );
                    ?>
                    <div class="col-md-12">
                        <div class="imghoverclass img-margin-center" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
                            <a href="<?php the_permalink()  ?>" title="<?php the_title_attribute(); ?>">
                                <img src="<?php echo esc_url( $img[ 'src' ] ); ?>" alt="<?php the_title_attribute(); ?>" width="<?php echo esc_attr( $img[ 'width' ] );?>" height="<?php echo esc_attr( $img[ 'height' ] );?>" itemprop="contentUrl"  class="<?php echo esc_attr( $img[ 'class' ] );?>" <?php echo wp_kses_post(  $img[ 'srcset' ] ); ?>>
                                    <meta itemprop="url" content="<?php echo esc_url( $img[ 'src' ] ); ?>">
                                    <meta itemprop="width" content="<?php echo esc_attr( $img[ 'width' ] )?>">
                                    <meta itemprop="height" content="<?php echo esc_attr( $img[ 'height' ] )?>">
                            </a> 
                        </div>
                    </div>
                    <?php
            } elseif($postsummery == 'img_portrait') {
				if( $virtue_sidebar ) {
					$textsize = 'col-md-7';
					$featsize = 'col-md-5';
				} else {
					$textsize = 'col-md-8';
					$featsize = 'col-md-4';
				}
                $image_id = get_post_thumbnail_id( $post->ID );
            	$img = virtue_get_image_array( $portraitwidth, $portraitheight, true, 'iconhover', null, $image_id, true );
              	?>
                <div class="<?php echo esc_attr( $featsize ); ?> post-image-container">
                    <div class="imghoverclass img-margin-center" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
                        <a href="<?php the_permalink()  ?>" title="<?php the_title_attribute(); ?>">
                            <img src="<?php echo esc_url( $img[ 'src' ] ); ?>" alt="<?php the_title_attribute(); ?>" width="<?php echo esc_attr( $img[ 'width' ] );?>" height="<?php echo esc_attr( $img[ 'height' ] );?>" itemprop="contentUrl"   class="<?php echo esc_attr( $img[ 'class' ] );?>" <?php echo wp_kses_post(  $img[ 'srcset' ] ); ?>>
								<meta itemprop="url" content="<?php echo esc_url( $img[ 'src' ] ); ?>">
								<meta itemprop="width" content="<?php echo esc_attr( $img[ 'width' ] )?>">
								<meta itemprop="height" content="<?php echo esc_attr( $img[ 'height' ] )?>">
                        </a> 
                     </div>
                 </div>
                    <?php
            } elseif($postsummery == 'slider_landscape') {
                $textsize = 'col-md-12'; ?>
                <div class="col-md-12">
                    <div class="flexslider kt-flexslider loading" style="max-width:<?php echo esc_attr($slidewidth);?>px;" data-flex-speed="7000" data-flex-anim-speed="400" data-flex-animation="fade" data-flex-auto="true">
                        <ul class="slides">
                            <?php
                            $image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );
                            if(!empty($image_gallery)) {
                                $attachments = array_filter( explode( ',', $image_gallery ) );
                                if ($attachments) {
                                    foreach ($attachments as $attachment) {
                                    	$img = virtue_get_image_array( $slidewidth, $slideheight, true, null, null, $attachment, true );
                                        ?>
                                            <li>
                                                <a href="<?php the_permalink() ?>" title="<?php the_title_attribute(); ?>" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
                                                    <img src="<?php echo esc_url( $img[ 'src' ] ); ?>" itemprop="contentUrl" alt="<?php echo esc_attr( $img[ 'alt' ] );?>" width="<?php echo esc_attr( $img[ 'width' ] );?>" height="<?php echo esc_attr( $img[ 'height' ] );?>"  <?php echo wp_kses_post(  $img[ 'srcset' ] ); ?> />
													<meta itemprop="url" content="<?php echo esc_url( $img[ 'src' ] ); ?>">
													<meta itemprop="width" content="<?php echo esc_attr( $img[ 'width' ] )?>">
													<meta itemprop="height" content="<?php echo esc_attr( $img[ 'height' ] )?>">
                                            </a>
                                        </li>
                                    <?php 
                                    }
                                  }
                                } ?>                                   
                        </ul>
                    </div> <!--Flex Slides-->
                </div>
            <?php 
            } elseif($postsummery == 'slider_portrait') {
            	if( $virtue_sidebar ) {
                	$textsize = 'col-md-7';
                	$featsize = 'col-md-5';
                } else {
                	$textsize = 'col-md-8';
                	$featsize = 'col-md-4';
                }?>
                <div class="<?php echo esc_attr( $featsize ); ?> post-image-container">
                    <div class="flexslider kt-flexslider loading" data-flex-speed="7000" data-flex-anim-speed="400" data-flex-animation="fade" data-flex-auto="true">
                        <ul class="slides">
                            <?php 
                            $image_gallery = get_post_meta( $post->ID, '_kad_image_gallery', true );
                                if(!empty($image_gallery)) {
                                    $attachments = array_filter( explode( ',', $image_gallery ) );
                                    if ($attachments) {
                                        foreach ($attachments as $attachment) {
                                        	$img = virtue_get_image_array(  $portraitwidth, $portraitheight, true, null, null, $attachment, true ); ?>
                                            <li>
                                                <a href="<?php the_permalink() ?>" title="<?php the_title_attribute(); ?>" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
                                                    <img src="<?php echo  esc_url( $img[ 'src' ] ); ?>" alt="<?php echo esc_attr( $img[ 'alt' ] );?>" itemprop="contentUrl" width="<?php echo esc_attr( $img[ 'width' ] );?>" height="<?php echo esc_attr( $img[ 'height' ] );?>"  <?php echo wp_kses_post(  $img[ 'srcset' ] ); ?> />
													<meta itemprop="url" content="<?php echo esc_url( $img[ 'src' ] ); ?>">
													<meta itemprop="width" content="<?php echo esc_attr( $img[ 'width' ] )?>">
													<meta itemprop="height" content="<?php echo esc_attr( $img[ 'height' ] )?>">
                                                </a>
                                            </li>
                                        <?php 
                                        }
                                    }
                                } ?>           
                        </ul>
                    </div> <!--Flex Slides-->
                </div>
            <?php 
            } elseif($postsummery == 'video') {
                    $textsize = 'col-md-12'; ?>
                    <div class="col-md-12">
                        <div class="videofit">
                            <?php
                            $allowed_tags = wp_kses_allowed_html('post');
							$allowed_tags['iframe'] = array(
								'src'             => true,
								'height'          => true,
								'width'           => true,
								'frameborder'     => true,
								'allowfullscreen' => true,
								'name' 			  => true,
								'id' 			  => true,
								'class' 		  => true,
								'style' 		  => true,
							);

							echo do_shortcode( wp_kses( get_post_meta( $post->ID, '_kad_post_video', true ), $allowed_tags ) );
							?>
                        </div>
                    </div>
                    <?php if (has_post_thumbnail( $post->ID ) ) { 
                        $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' ); ?>
	                    <div itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
	                        <meta itemprop="url" content="<?php echo esc_url( $image[0] ); ?>">
	                        <meta itemprop="width" content="<?php echo esc_attr( $image[1] )?>">
	                        <meta itemprop="height" content="<?php echo esc_attr( $image[2] )?>">
	                    </div>
                    <?php } ?>

            <?php 
            } else { 
                $textsize = 'col-md-12 kttextpost'; 
            } ?>

            <div class="<?php echo esc_attr( $textsize );?> post-text-container postcontent">
                <?php  get_template_part('admin/templates/`+name+`/prioridade'); ?> 
                <header>
                    <a href="<?php the_permalink() ?>">
                        <h2 class="entry-title" itemprop="name headline">
                            <?php the_title(); ?> 
                        </h2>
                    </a>
                    <?php get_template_part('templates/entry', 'meta-subhead'); ?>    
                </header>
                <div class="entry-content" itemprop="description">
                    <?php 
                        do_action( 'kadence_post_excerpt_content_before' );
                        
                        the_excerpt(); 
                        
                        do_action( 'kadence_post_excerpt_content_after' );
                    ?>
                </div>
                <footer>
                <?php do_action( 'kadence_post_excerpt_footer' );
                    $tags = get_the_tags(); 
                    if ( $tags ) { ?>
                        <span class="posttags color_gray"><i class="icon-tag"></i> <?php the_tags('', ', ', ''); ?></span>
                    <?php } ?>
                </footer>
            </div><!-- Text size -->
        </div><!-- row-->
    </article> <!-- Article -->`;
    createFile(path + '/content.php',conteudo);
}

 page(name,theme);
single(name,theme);
loop(name,categoria);
prioridade(categoria);
content(name,categoria);

function createFile(name,conteudo){
	var fs = require('fs');
	fs.writeFile(name, conteudo, function (err) {
	  if (err) throw err;
	  console.log('File is created successfully.');
	});
}
 