<?php
// Do you need more than one stylesheet?
define( 'additional_css', false );
// Where? What CSS do you need to include?
$styles = array(
     '/additional/Styles.css'
);


// use web fonts?
define( 'web_fonts', false );
// if using web fonts, where are they?
$fonts = array(
'http://fonts.googleapis.com/css?family=Droid+Serif:400,700,700italic,400italic'
);


// should we remove all the WordPress junk from the head?
define( 'clean_head', true );
// Wordpress adds a some css to the head to style the Recent Comments Widget, should we remove it?
define( 'no_recent_comments_style', true );


// use jquery? If not, menus will break
define( 'jquery', true );
// Where? true loads jquery in footer, false in header
define( 'header_or_footer', true );


// add CSS classes that allow the sidebar to be split for responsive design? if true use .sidebar-col-1 and .sidebar-col-2 to style the split
define( 'js_sidebar_split', false );

// Use WordPress Gallery CSS?
define( 'kill_gallery_styles', false );


define( 'post_formats', true );


// Is the default excerpt too short? Change "false" to an integer to change the length of the excerpt. The WordPress default is 85 words. If a non-integer, non-boolean value is input, the default is used.
define( 'custom_excerpt_length', false );

// if using a custom excerpt, do you want to allow specific HTML tags. WordPress doesn't allow any HTML in the excerpt by default. Accepts a string that looks like '<br>, <p>, <h2>'
define( 'custom_excerpt_tags', '' );


?>