<?php // enable custom (background borrowed from _s)
function _skele_register_custom_background( ) {
    $args = array(
         'default-color' => 'ffffff',
        'default-image' => ''
    );

    $args = apply_filters( '_skele_custom_background_args', $args );

    if ( function_exists( 'wp_get_theme' ) ) {
        add_theme_support( 'custom-background', $args );

    } //function_exists( 'wp_get_theme' )

}

add_action( 'after_setup_theme', '_skele_register_custom_background' );?>
