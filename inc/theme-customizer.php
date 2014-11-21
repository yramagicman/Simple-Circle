<?php
function _skele_customize_register($wp_customize) {
    //All our sections, settings, and controls will be added here
    $colors   = array();
    $colors[] = array(
            'slug' => 'link_color',
            'default' => '#444',
            'label' => __('Link Color', '_skele')
            );
    $colors[] = array(
            'slug' => 'visited_link_color',
            'default' => '#777',
            'label' => __('Visited Link Color', '_skele')
            );
    $colors[] = array(
            'slug' => 'hover_link_color',
            'default' => '#007800',
            'label' => __('hovered Link Color', '_skele')
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
    $link_color = get_option('link_color');
    $visited_link_color = get_option('visited_link_color');
    $hovered_link_color = get_option('hover_link_color');
    ?>
        <style>
        a:link{
            color:<?php echo $link_color ?>;
        }
        a:visited{
            color:<?php echo $visited_link_color ?>;
        }
        a:hover{
            color:<?php echo $hovered_link_color ?>;
        }
    </style>
        <?php
}
add_filter('wp_head', '_skele_customize_function');
?>
