<?php
get_header();
/*
    See markup.php for loop code and markup. markup.php contains HTML and logic to create a single file that contains all the necessary markup for a theme to work properly. This makes changing things like layout a lot easier, especially when using a CSS grid system (2 files, markup.php and sidebar.php, to change instead of 3+).
*/
get_template_part('markup');

get_footer();
?>
