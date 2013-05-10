(function() { //jQuery function that adds a pad around menus
    'use strict';
    var x, j;
    j = jQuery.noConflict();

    //detect elements
    var wrapPad = function(elem) {
        if (j(elem).length) {
            x = j(elem);
            x.wrap('<div class="pad">');
            j(elem).addClass('force-show');
        }
    };
    var elems = ['nav .children', 'nav .sub-menu'];
    for (var i = elems.length - 1; i >= 0; i--) {
        wrapPad(elems[i]);
    }
    j(window).resize(function() {
        if (j(document).innerWidth() > 768) {
            var y = j('.inner').width();
            j('.inner').height(y);
        } else{
            j('.inner').removeAttr('style');
        }
    });
    j(window).trigger('resize');
})(); // end menus
