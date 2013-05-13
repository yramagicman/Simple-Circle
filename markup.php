<!--<div id="content" class="content col push-span12">-->
    <?php
    // do we want the sidebar?
    if(is_page_template('page-no-sidebar.php')):
        // if so, expand the content area to fit the entire page.
        ?>
        <div id="body" class="body col span12">
    <?php else:
        // if not, make room for the sidebar
        ?>
        <div id="body" class="body col span8 alignright">
    <?php endif;?>
    <!-- spare div, if you need it. -->
        <div id="padding" class="padding">
        <?php
        // begin the loop
        if ( have_posts() ) :
            _skele_page_title($s, $posts[0], $cat, $tag);
            while ( have_posts() ) : the_post();
        ?>
            <div <?php post_class('post-wrap'); ?>>
               <?php
               // if not a page, show meta info and post title
               if (!is_page()): ?>
                <h2 class="post-title">
                    <a href="<?php the_permalink(); ?>"><?php the_title() ?></a>
                </h2>
                <aside class="meta">
                    <span class="author">
                        Posted By <?php the_author(); ?>
                    </span>
                    <span class="date">
                        On <?php the_date(); ?>
                    </span>
                </aside>
                <?php endif; ?>
                <!--end meta-->
                <article class="post-content">
                    <?php
                    if (is_singular()) {
                        // show full post where appropriate
                        the_content();
                    } else {
                        // otherwise show the thumbnail and excerpt
                        the_post_thumbnail();
                        the_excerpt();
                    }
                    ?>
                </article>
                <!--
                    TODO need logic to remove this empty markup from post nav, category nav and tags.
                -->
                <?php if (is_singular()): ?>
                <nav class="post-nav">
                    <?php wp_link_pages( ); ?>
                </nav>
                <!--end article-->
                <?php if (!is_page()): ?>
                <aside class="cats">
                    Categories <?php the_category(', '); ?>
                </aside>
                <!--end categroies-->
            <?php if(has_tag()): ?>
                <aside class="tags">
                    <?php the_tags(); ?>
                </aside>
                <!-- end tags -->
            <?php endif; 
            // end has_tag()
            ?>
            <?php endif; 
            // end !is_page()
            ?>
            <?php endif; 
            //end global tag and category if
            ?>

            </div>
            <!--end post-wrap-->
            <?php if ( current_user_can('edit_post', get_the_ID()) ) : ?>
                <small class="editlink">
                    <?php edit_post_link('Edit this entry?','',''); ?>
                </small>
            <?php endif; ?>
            <?php if (function_exists('wp_list_comments') ): ?>
              <div class="comments clearfix">
            <!-- WP 2.7 and above -->
            <?php comments_template('', true); ?>
            </div>
            <?php endif;?>
            <?php endwhile; // end of loop
            // if we don't have any posts, inform the readers that they broke the internet
             else: ?>
            <div <?php post_class('post-wrap'); ?>>
                <article class="post">
                    Whoops, you broke the internet. You'll find that the back button or the search bar might fix the problem.
                </article>
            </div>
        <?php
        endif;
        // end if(have_posts())
         ?>
        <?php if (!is_singular()):
            // if not a page, show entry navigation
         ?>
        <div class="navigation">
            <div class="alignleft">
                <?php next_posts_link('Older Entries') ?>
            </div>
            <div class="alignright">
                <?php previous_posts_link('Newer Entries') ?>
            </div>
        </div>
        <?php endif;?>
        </div>
    </div> <!--end body -->
      <?php
      // Is the sidebar wanted?
      if (!is_page_template('page-no-sidebar.php')) {
          // If so, show it
          get_sidebar();
      }
      ?>
<!--</div>-->
<!-- end content -->
