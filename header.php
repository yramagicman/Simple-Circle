<?php  ?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html <?php language_attributes(); ?>  class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html <?php language_attributes(); ?> class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html <?php language_attributes(); ?> class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html <?php language_attributes(); ?> class="no-js"> <!--<![endif]-->
<head>
<meta charset="<?php bloginfo('charset'); ?>"/>
<title>
<?php wp_title();?>
</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<a href="#content" class="visuallyHidden">Skip To Content</a>
<div id="container" class="container">
  <header class="col span4">
    <div class="inner">
      <h1 id="page-title" class="page-title">
        <a href="<?php echo home_url(); ?>"><?php bloginfo('name');?></a>
      </h1>
      <h1 id="sub-title" class="sub-title">
        <?php bloginfo('description');?>
      </h1>
    </div>
   <nav id="nav" class="span12-no-margin"><?php _skele_header_menu(); ?></nav>
  </header>
  <a href="#nav" class="mobileOnly shownav">Show Navigation</a>
  <a href="#sidebar" class="mobileOnly showsidebar">Sidebar</a>
