<?php
function _skele_styles_and_scripts() {
    // call everyting
    _skele_comments();
    _skele_modernizr();
    _skele_jquery();
    _skele_fonts();
    _skele_styles();
}
// get file time for versioning
function _skele_time ($file_path){
   return filemtime(get_template_directory()
                .$file_path);
}
// WordPress required comments function.
function _skele_comments() {
    if (is_singular() AND comments_open() AND (get_option('thread_comments') == 1)) {
        wp_enqueue_script('comment-reply');
    } //is_singular() AND comments_open() AND ( get_option( 'thread_comments' ) == 1 )
}

// since this is HTML5 we always use modernizr
function _skele_modernizr() {
    wp_enqueue_script('modernizr', get_template_directory_uri()
        .'/scripts/vendor/modernizr.js', __FILE__,
        _skele_time('/scripts/vendor/modernizr.js'));
}
// are we using jquery?
function _skele_jquery() {
    if (jquery) {
        // what copy?
        wp_enqueue_script('jquery', __FILE__, __FILE__, filemtime(__FILE__),
            header_or_footer);
        // enque navigation script, and other jquery
        wp_enqueue_script('plugins', get_template_directory_uri()
        .'/scripts/plugins.js', array('jquery'),
        _skele_time('/scripts/plugins.js'), header_or_footer);
    } //jquery
}

function _skele_fonts() {
    if (web_fonts) {
        //use FOUT prevention library
        wp_enqueue_script('no-fout', get_template_directory_uri()
            .'/scripts/vendor/foutbgone.js', __FILE__,
            _skele_time('/scripts/vendor/foutbgone.js'));
        global $fonts; // access fonts array from config, don't modify it here
        // loop through fonts and enqueue them
        foreach($fonts as $value) {
            static $i = 1;
            wp_enqueue_style("fonts$i", $value,
            __FILE__,_skele_time('/style.css'), 'all'); //use modification time of main CSS file for versioning fonts.
            // enque fonts
            $i++;
        } //$fonts as $value
    } //web_fonts
    // Redundant if using Less or SASS/Compass
}

// if minification is on, minify styles via php script, othwise output non-minified CSS
function _skele_styles () {
        if (additional_css) {
            _skele_enqueue_css();
        } //additional_css
        else {
            wp_enqueue_style('skele_css', get_stylesheet_uri(), __FILE__,
                _skele_time('/style.css'), 'all');
        }
}

function _skele_enqueue_css() {
    // $my_theme = wp_get_theme(); //why was this here?
    // enque main css file
    wp_enqueue_style('skele_css', get_stylesheet_uri(), __FILE__,
        _skele_time('/style.css'), 'all');
    // access stylesheet array, don't modify it here
    global $styles;
    // loop over styles and enque them
    foreach($styles as $value) {
        // counter to assign unique numeric id to each css file
        static $i = 1;
        // enque css
        wp_enqueue_style("styles$i", get_template_directory_uri().$value,
            __FILE__, _skele_time($value), 'all');
        // incriment counter
        $i++;
    } //$styles as $value
}

function _skele_webfonts() { ?>
     <script type = "text/javascript" >
     // kill FOUT
     // http://paulirish.com/2009/fighting-the-font-face-fout/
     fbg.hideFOUT('asap');
     </script>
  <?php
}
?>
