<?php get_header();?>
<div id="content">
  <div id="body">
    <div id="padding">
      <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <div class="post" id="post-<?php the_ID(); ?>">
        <h2><a href="<?php echo get_permalink($post->post_parent); ?>" rev="attachment"><?php echo get_the_title($post->post_parent); ?></a> &raquo;
          <?php the_title(); ?>
        </h2>
        <aside class="meta"> <span class="author">Posted By
          <?php the_author(); ?>
          </span> <span class="date">On
          <?php the_date(); ?>
          </span> </aside>
        <article class="imgPost">
          <!--open imgPost-->
          <figure class="attachment"><a href="<?php echo wp_get_attachment_url($post->ID); ?>"><?php echo wp_get_attachment_image( $post->ID, 'medium' ); ?></a>
            <figcaption class="caption">
              <?php if ( !empty($post->post_excerpt) ) the_excerpt(); // this is the "caption" ?>
            </figcaption>
          </figure>
          <?php the_content('<p>Read the rest of this entry &raquo;</p>'); ?>
          <div class="navigation">
            <div class="alignleft">
              <?php previous_image_link() ?>
            </div>
            <div class="alignright">
              <?php next_image_link() ?>
            </div>
          </div>
          <br class="clear" />
          <p class="postmetadata alt"> <small> This entry was posted on
           <aside class="cats">
          <?php the_category(); ?>
        </aside>
        <!--end categroies-->
        <aside class="tags">
          <?php the_tags(); ?>
        </aside>
         <?php if ( comments_open() && pings_open() ) {
                            // Both Comments and Pings are open ?>
            You can <a href="#respond">leave a response</a>, or <a href="<?php trackback_url(); ?>" rel="trackback">trackback</a> from your own site.
            <?php } elseif ( !comments_open() && pings_open() ) {
                            // Only Pings are Open ?>
            Responses are currently closed, but you can <a href="<?php trackback_url(); ?> " rel="trackback">trackback</a> from your own site.
            <?php } elseif ( comments_open() && !pings_open() ) {
                            // Comments are open, Pings are not ?>
            You can skip to the end and leave a response. Pinging is currently not allowed.
            <?php } elseif ( !comments_open() && !pings_open() ) {
                            // Neither Comments, nor Pings are open ?>
            Both comments and pings are currently closed.
            <?php } edit_post_link('Edit this entry.','',''); ?>
            </small> </p>
        </article>
        <!--close imgPost -->
      </div>
      <?php if (function_exists('wp_list_comments')): ?>
      <!-- WP 2.7 and above -->
      <?php comments_template('', true); ?>

      <?php endif; ?>

      <?php endwhile; else: ?>
      <p>Sorry, no attachments matched your criteria.</p>
      <?php endif; ?>
    </div>
  </div>
  <?php get_sidebar(); ?>
</div>
<?php get_footer(); ?>
