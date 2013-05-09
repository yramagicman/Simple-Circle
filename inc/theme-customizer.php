<?php
function _skele_customize_register($wp_customize) {
    //All our sections, settings, and controls will be added here
    $colors   = array();
    $colors[] = array(
            'slug' => 'header_background_color',
            'default' => '#c4532b',
            'label' => __('Header and footer background color', '_skele')
            );

    foreach ($colors as $color) {
        // SETTINGS
        $wp_customize->add_setting($color['slug'], array(
                    'default' => $color['default'],
                    'type' => 'option',
                    'capability' => 'edit_theme_options'
                    ));
        // CONTROLS
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, $color['slug'], array(
                        'label' => $color['label'],
                        'section' => 'colors',
                        'settings' => $color['slug']
                        )));
    } //$colors as $color
}
add_action('customize_register', '_skele_customize_register');

function _skele_customize_function( ) {
    $header_background_color = get_option('header_background_color');
    ?>
        <style>
        header, footer, header:before, header:after, .noshadow:before, .noshadow:after{
            background:<?php echo $header_background_color ?>;
        }
    </style>
        <?php
}
add_filter('wp_head', '_skele_customize_function');
?>

