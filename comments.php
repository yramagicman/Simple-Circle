<?php

// Do not delete these lines
    if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
        die ('Please do not load this page directly. Thanks!');

    if ( post_password_required() ) { ?>

<p class="nocomments">This post is password protected. Enter the password to view comments.</p>
<?php
        return;
    }
?>
<!-- You can start editing here -->
<?php if ( have_comments() ) : ?>
<h3 class="comments">
                <?php comments_number('No Responses', 'One Response', '% Responses' );?>
                to &#8220;
                <?php the_title(); ?>
                &#8221;</h3>
<div class="navigation">
                <div class="alignleft">
                                <?php previous_comments_link() ?>
                </div>
                <div class="alignright">
                                <?php next_comments_link() ?>
                </div>
</div>
<ol class="commentlist">
                <?php wp_list_comments(); ?>
</ol>
<div class="navigation">
                <div class="alignleft">
                                <?php previous_comments_link() ?>
                </div>
                <div class="alignright">
                                <?php next_comments_link() ?>
                </div>
</div>
<?php else : // this is displayed if there are no comments so far ?>
<?php if ( comments_open() ) : ?>
<!-- If comments are open, but there are no comments. -->
<?php else : // comments are closed ?>
<!-- If comments are closed. -->
<?php if (!is_page()) { ?>
<p class="nocomments">Comments are closed.</p>
<?php }?>
<?php endif; ?>
<?php endif; ?>
<?php if ( comments_open() ) : ?>
<div id="respond">
                <?php comment_form();?>
</div>
<?php endif; // if you delete this the qqq will fall on your head ?>
