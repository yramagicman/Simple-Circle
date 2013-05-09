/*!
 * Modernizr v3.0.0pre
 * modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton, Ryan Seddon, Alexander Farkas, Ben Alman, Stu Cox
 * MIT License
 */ 
/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
 *
 * Modernizr has an optional (*not included*) conditional resource loader called
 * `Modernizr.load()`, based on [Yepnope.js](http://yepnopejs.com). You can get a
 * build that includes `Modernizr.load()`, as well as choosing which feature tests
 * to include on the [Download page](http://www.modernizr.com/download/).
 */
;(function(window, document, undefined){

  var tests = [];
  

  var ModernizrProto = {
    // The current version, dummy
    _version : 'v3.0.0pre',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config : {
      classPrefix : '',
      enableClasses : true
    },

    _q : [],

    addTest : function( name, fn, options ) {
      tests.push({name : name, fn : fn, options : options });
    },

    addAsyncTest : function (fn) {
      tests.push({name : null, fn : fn});
    }
  };

  

  // Fake some of Object.create
  // so we can force non test results
  // to be non "own" properties.
  var Modernizr = function(){};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it
  // rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  

  var classes = [];
  

  /**
   * is returns a boolean for if typeof obj is exactly type.
   */
  function is( obj, type ) {
    return typeof obj === type;
  }
  ;

  // Run through all tests and detect their support in the current UA.
  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    for ( var featureIdx in tests ) {
      featureNames = [];
      feature = tests[featureIdx];
      // run the test, throw the return value into the Modernizr,
      //   then based on that boolean, define an appropriate className
      //   and push it into an array of classes we'll join later.
      //
      //   If there is no name, it's an 'async' test that is run,
      //   but not directly added to the object. That should
      //   be done with a post-run addTest call.
      if ( feature.name ) {
        featureNames.push(feature.name.toLowerCase());

        if (feature.options && feature.options.aliases && feature.options.aliases.length) {
          // Add all the aliases into the names list
          for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
            featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
          }
        }
      }

      // Run the test, or use the raw value if it's not a function
      result = is(feature.fn, 'function') ? feature.fn() : feature.fn;

      // Set each of the names on the Modernizr object
      for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
        Modernizr[featureNames[nameIdx]] = result;
        classes.push((Modernizr[featureNames[nameIdx]] ? '' : 'no-') + featureNames[nameIdx]);
      }
    }
  }

  ;

  var docElement = document.documentElement;
  

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses( classes ) {
    var className = docElement.className;
    var removeClasses = [];
    var regex;

    // Change `no-js` to `js` (we do this regardles of the `enableClasses`
    // option)
    className = className.replace(/(^|\s)no-js(\s|$)/, '$1js$2');

    if(Modernizr._config.enableClasses) {
      // Need to remove any existing `no-*` classes for features we've detected
      for(var i = 0; i < classes.length; i++) {
        if(!classes[i].match('^no-')) {
          removeClasses.push('no-' + classes[i]);
        }
      }

      // Use a regex to remove the old...
      regex = new RegExp('(^|\\s)' + removeClasses.join('|') + '(\\s|$)', 'g');
      className = className.replace(regex, '$1$2');

      // Then add the new...
      className += ' ' + classes.join(' ' + (Modernizr._config.classPrefix || ''));

      // Apply
      docElement.className = className;
    }

  }

  ;

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var hasOwnProp;

  (function() {
    var _hasOwnProperty = ({}).hasOwnProperty;
    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }
  })();

  

  /**
   * addTest allows the user to define their own feature tests
   * the result will be added onto the Modernizr object,
   * as well as an appropriate className set on the html element
   *
   * @param feature - String naming the feature
   * @param test - Function returning true if feature is supported, false if not
   */
  function addTest( feature, test ) {
    if ( typeof feature == 'object' ) {
      for ( var key in feature ) {
        if ( hasOwnProp( feature, key ) ) {
          addTest( key, feature[ key ] );
        }
      }
    } else {

      feature = feature.toLowerCase();

      if ( Modernizr[feature] !== undefined ) {
        // we're going to quit if you're trying to overwrite an existing test
        // if we were to allow it, we'd do this:
        //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
        //   docElement.className = docElement.className.replace( re, '' );
        // but, no rly, stuff 'em.
        return Modernizr;
      }

      test = typeof test == 'function' ? test() : test;

      Modernizr[feature] = test;

      // Set a single class (either `feature` or `no-feature`)
      setClasses([(test ? '' : 'no-') + feature]);
    }

    return Modernizr; // allow chaining.
  }

  // After all the tests are run, add self
  // to the Modernizr prototype
  Modernizr._q.push(function() {
    ModernizrProto.addTest = addTest;
  });

  

  // Take the html5 variable out of the
  // html5shiv scope so we can return it.
  var html5;

  /**
   * @preserve HTML5 Shiv v3.6.2pre | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
   */
  ;(function(window, document) {
  /*jshint evil:true */
    /** version */
    var version = '3.6.2';

    /** Preset options */
    var options = window.html5 || {};

    /** Used to skip problem elements */
    var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

    /** Not all elements can be cloned in IE **/
    var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

    /** Detect whether the browser supports default html5 styles */
    var supportsHtml5Styles;

    /** Name of the expando, to work with multiple documents or to re-shiv one document */
    var expando = '_html5shiv';

    /** The id for the the documents expando */
    var expanID = 0;

    /** Cached data for each document */
    var expandoData = {};

    /** Detect whether the browser supports unknown elements */
    var supportsUnknownElements;

    (function() {
      try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
      } catch(e) {
        // assign a false positive if detection fails => unable to shiv
        supportsHtml5Styles = true;
        supportsUnknownElements = true;
      }

    }());

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a style sheet with the given CSS text and adds it to the document.
     * @private
     * @param {Document} ownerDocument The document.
     * @param {String} cssText The CSS text.
     * @returns {StyleSheet} The style element.
     */
    function addStyleSheet(ownerDocument, cssText) {
      var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

      p.innerHTML = 'x<style>' + cssText + '</style>';
      return parent.insertBefore(p.lastChild, parent.firstChild);
    }

    /**
     * Returns the value of `html5.elements` as an array.
     * @private
     * @returns {Array} An array of shived element node names.
     */
    function getElements() {
      var elements = html5.elements;
      return typeof elements == 'string' ? elements.split(' ') : elements;
    }

      /**
     * Returns the data associated to the given document
     * @private
     * @param {Document} ownerDocument The document.
     * @returns {Object} An object of data.
     */
    function getExpandoData(ownerDocument) {
      var data = expandoData[ownerDocument[expando]];
      if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
      }
      return data;
    }

    /**
     * returns a shived element for the given nodeName and document
     * @memberOf html5
     * @param {String} nodeName name of the element
     * @param {Document} ownerDocument The context document.
     * @returns {Object} The shived element.
     */
    function createElement(nodeName, ownerDocument, data){
      if (!ownerDocument) {
        ownerDocument = document;
      }
      if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
      }
      if (!data) {
        data = getExpandoData(ownerDocument);
      }
      var node;

      if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
      } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
      } else {
        node = data.createElem(nodeName);
      }

      // Avoid adding some elements to fragments in IE < 9 because
      // * Attributes like `name` or `type` cannot be set/changed once an element
      //   is inserted into a document/fragment
      // * Link elements with `src` attributes that are inaccessible, as with
      //   a 403 response, will cause the tab/window to crash
      // * Script elements appended to fragments will execute when their `src`
      //   or `text` property is set
      return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
    }

    /**
     * returns a shived DocumentFragment for the given document
     * @memberOf html5
     * @param {Document} ownerDocument The context document.
     * @returns {Object} The shived DocumentFragment.
     */
    function createDocumentFragment(ownerDocument, data){
      if (!ownerDocument) {
        ownerDocument = document;
      }
      if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
      }
      data = data || getExpandoData(ownerDocument);
      var clone = data.frag.cloneNode(),
          i = 0,
          elems = getElements(),
          l = elems.length;
      for(;i<l;i++){
        clone.createElement(elems[i]);
      }
      return clone;
    }

    /**
     * Shivs the `createElement` and `createDocumentFragment` methods of the document.
     * @private
     * @param {Document|DocumentFragment} ownerDocument The document.
     * @param {Object} data of the document.
     */
    function shivMethods(ownerDocument, data) {
      if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
      }


      ownerDocument.createElement = function(nodeName) {
        //abort shiv
        if (!html5.shivMethods) {
          return data.createElem(nodeName);
        }
        return createElement(nodeName, ownerDocument, data);
      };

      ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
        'var n=f.cloneNode(),c=n.createElement;' +
        'h.shivMethods&&(' +
          // unroll the `createElement` calls
          getElements().join().replace(/\w+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
          }) +
        ');return n}'
      )(html5, data.frag);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Shivs the given document.
     * @memberOf html5
     * @param {Document} ownerDocument The document to shiv.
     * @returns {Document} The shived document.
     */
    function shivDocument(ownerDocument) {
      if (!ownerDocument) {
        ownerDocument = document;
      }
      var data = getExpandoData(ownerDocument);

      if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
        data.hasCSS = !!addStyleSheet(ownerDocument,
          // corrects block display not defined in IE6/7/8/9
          'article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
          // adds styling not present in IE6/7/8/9
          'mark{background:#FF0;color:#000}'
        );
      }
      if (!supportsUnknownElements) {
        shivMethods(ownerDocument, data);
      }
      return ownerDocument;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * The `html5` object is exposed so that more elements can be shived and
     * existing shiving can be detected on iframes.
     * @type Object
     * @example
     *
     * // options can be changed before the script is included
     * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
     */
    html5 = {

      /**
       * An array or space separated string of node names of the elements to shiv.
       * @memberOf html5
       * @type Array|String
       */
      'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video',

      /**
       * current version of html5shiv
       */
      'version': version,

      /**
       * A flag to indicate that the HTML5 style sheet should be inserted.
       * @memberOf html5
       * @type Boolean
       */
      'shivCSS': (options.shivCSS !== false),

      /**
       * Is equal to true if a browser supports creating unknown/HTML5 elements
       * @memberOf html5
       * @type boolean
       */
      'supportsUnknownElements': supportsUnknownElements,

      /**
       * A flag to indicate that the document's `createElement` and `createDocumentFragment`
       * methods should be overwritten.
       * @memberOf html5
       * @type Boolean
       */
      'shivMethods': (options.shivMethods !== false),

      /**
       * A string to describe the type of `html5` object ("default" or "default print").
       * @memberOf html5
       * @type String
       */
      'type': 'default',

      // shivs the document according to the specified `html5` object options
      'shivDocument': shivDocument,

      //creates a shived element
      createElement: createElement,

      //creates a shived documentFragment
      createDocumentFragment: createDocumentFragment
    };

    /*--------------------------------------------------------------------------*/

    // expose html5
    window.html5 = html5;

    // shiv the document
    shivDocument(document);

    /*------------------------------- Print Shiv -------------------------------*/

    /** Used to filter media types */
    var reMedia = /^$|\b(?:all|print)\b/;

    /** Used to namespace printable elements */
    var shivNamespace = 'html5shiv';

    /** Detect whether the browser supports shivable style sheets */
    var supportsShivableSheets = !supportsUnknownElements && (function() {
      // assign a false negative if unable to shiv
      var docEl = document.documentElement;
      return !(
        typeof document.namespaces == 'undefined' ||
        typeof document.parentWindow == 'undefined' ||
        typeof docEl.applyElement == 'undefined' ||
        typeof docEl.removeNode == 'undefined' ||
        typeof window.attachEvent == 'undefined'
      );
    }());

    /*--------------------------------------------------------------------------*/

    /**
     * Wraps all HTML5 elements in the given document with printable elements.
     * (eg. the "header" element is wrapped with the "html5shiv:header" element)
     * @private
     * @param {Document} ownerDocument The document.
     * @returns {Array} An array wrappers added.
     */
    function addWrappers(ownerDocument) {
      var node,
          nodes = ownerDocument.getElementsByTagName('*'),
          index = nodes.length,
          reElements = RegExp('^(?:' + getElements().join('|') + ')$', 'i'),
          result = [];

      while (index--) {
        node = nodes[index];
        if (reElements.test(node.nodeName)) {
          result.push(node.applyElement(createWrapper(node)));
        }
      }
      return result;
    }

    /**
     * Creates a printable wrapper for the given element.
     * @private
     * @param {Element} element The element.
     * @returns {Element} The wrapper.
     */
    function createWrapper(element) {
      var node,
          nodes = element.attributes,
          index = nodes.length,
          wrapper = element.ownerDocument.createElement(shivNamespace + ':' + element.nodeName);

      // copy element attributes to the wrapper
      while (index--) {
        node = nodes[index];
        node.specified && wrapper.setAttribute(node.nodeName, node.nodeValue);
      }
      // copy element styles to the wrapper
      wrapper.style.cssText = element.style.cssText;
      return wrapper;
    }

    /**
     * Shivs the given CSS text.
     * (eg. header{} becomes html5shiv\:header{})
     * @private
     * @param {String} cssText The CSS text to shiv.
     * @returns {String} The shived CSS text.
     */
    function shivCssText(cssText) {
      var pair,
          parts = cssText.split('{'),
          index = parts.length,
          reElements = RegExp('(^|[\\s,>+~])(' + getElements().join('|') + ')(?=[[\\s,>+~#.:]|$)', 'gi'),
          replacement = '$1' + shivNamespace + '\\:$2';

      while (index--) {
        pair = parts[index] = parts[index].split('}');
        pair[pair.length - 1] = pair[pair.length - 1].replace(reElements, replacement);
        parts[index] = pair.join('}');
      }
      return parts.join('{');
    }

    /**
     * Removes the given wrappers, leaving the original elements.
     * @private
     * @params {Array} wrappers An array of printable wrappers.
     */
    function removeWrappers(wrappers) {
      var index = wrappers.length;
      while (index--) {
        wrappers[index].removeNode();
      }
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Shivs the given document for print.
     * @memberOf html5
     * @param {Document} ownerDocument The document to shiv.
     * @returns {Document} The shived document.
     */
    function shivPrint(ownerDocument) {
      var shivedSheet,
          wrappers,
          data = getExpandoData(ownerDocument),
          namespaces = ownerDocument.namespaces,
          ownerWindow = ownerDocument.parentWindow;

      if (!supportsShivableSheets || ownerDocument.printShived) {
        return ownerDocument;
      }
      if (typeof namespaces[shivNamespace] == 'undefined') {
        namespaces.add(shivNamespace);
      }

      function removeSheet() {
        clearTimeout(data._removeSheetTimer);
        if (shivedSheet) {
            shivedSheet.removeNode(true);
        }
        shivedSheet= null;
      }

      ownerWindow.attachEvent('onbeforeprint', function() {

        removeSheet();

        var imports,
            length,
            sheet,
            collection = ownerDocument.styleSheets,
            cssText = [],
            index = collection.length,
            sheets = Array(index);

        // convert styleSheets collection to an array
        while (index--) {
          sheets[index] = collection[index];
        }
        // concat all style sheet CSS text
        while ((sheet = sheets.pop())) {
          // IE does not enforce a same origin policy for external style sheets...
          // but has trouble with some dynamically created stylesheets
          if (!sheet.disabled && reMedia.test(sheet.media)) {

            try {
              imports = sheet.imports;
              length = imports.length;
            } catch(er){
              length = 0;
            }

            for (index = 0; index < length; index++) {
              sheets.push(imports[index]);
            }

            try {
              cssText.push(sheet.cssText);
            } catch(er){}
          }
        }

        // wrap all HTML5 elements with printable elements and add the shived style sheet
        cssText = shivCssText(cssText.reverse().join(''));
        wrappers = addWrappers(ownerDocument);
        shivedSheet = addStyleSheet(ownerDocument, cssText);

      });

      ownerWindow.attachEvent('onafterprint', function() {
        // remove wrappers, leaving the original elements, and remove the shived style sheet
        removeWrappers(wrappers);
        clearTimeout(data._removeSheetTimer);
        data._removeSheetTimer = setTimeout(removeSheet, 500);
      });

      ownerDocument.printShived = true;
      return ownerDocument;
    }

    /*--------------------------------------------------------------------------*/

    // expose API
    html5.type += ' print';
    html5.shivPrint = shivPrint;

    // shiv for print
    shivPrint(document);

  }(this, document));
  

// yepnope.js
// Version - 1.5.4pre
//
// by
// Alex Sexton - @SlexAxton - AlexSexton[at]gmail.com
// Ralph Holzmann - @ralphholzmann - ralphholzmann[at]gmail.com
//
// http://yepnopejs.com/
// https://github.com/SlexAxton/yepnope.js/
//
// Tri-license - WTFPL | MIT | BSD
//
// Please minify before use.
// Also available as Modernizr.load via the Modernizr Project
//
( function ( window, doc, undef ) {

var docElement            = doc.documentElement,
    sTimeout              = window.setTimeout,
    firstScript           = doc.getElementsByTagName( "script" )[ 0 ],
    toString              = {}.toString,
    execStack             = [],
    started               = 0,
    noop                  = function () {},
    // Before you get mad about browser sniffs, please read:
    // https://github.com/Modernizr/Modernizr/wiki/Undetectables
    // If you have a better solution, we are actively looking to solve the problem
    isGecko               = ( "MozAppearance" in docElement.style ),
    isGeckoLTE18          = isGecko && !! doc.createRange().compareNode,
    insBeforeObj          = isGeckoLTE18 ? docElement : firstScript.parentNode,
    // Thanks to @jdalton for showing us this opera detection (by way of @kangax) (and probably @miketaylr too, or whatever...)
    isOpera               = window.opera && toString.call( window.opera ) == "[object Opera]",
    isIE                  = !! doc.attachEvent && !isOpera,
    strJsElem             = isGecko ? "object" : isIE  ? "script" : "img",
    strCssElem            = isIE ? "script" : strJsElem,
    isArray               = Array.isArray || function ( obj ) {
      return toString.call( obj ) == "[object Array]";
    },
    isObject              = function ( obj ) {
      return Object(obj) === obj;
    },
    isString              = function ( s ) {
      return typeof s == "string";
    },
    isFunction            = function ( fn ) {
      return toString.call( fn ) == "[object Function]";
    },
    readFirstScript       = function() {
        if (!firstScript || !firstScript.parentNode) {
            firstScript = doc.getElementsByTagName( "script" )[ 0 ];
        }
    },
    globalFilters         = [],
    scriptCache           = {},
    prefixes              = {
      // key value pair timeout options
      timeout : function( resourceObj, prefix_parts ) {
        if ( prefix_parts.length ) {
          resourceObj['timeout'] = prefix_parts[ 0 ];
        }
        return resourceObj;
      }
    },
    handler,
    yepnope;

  /* Loader helper functions */
  function isFileReady ( readyState ) {
    // Check to see if any of the ways a file can be ready are available as properties on the file's element
    return ( ! readyState || readyState == "loaded" || readyState == "complete" || readyState == "uninitialized" );
  }


  // Takes a preloaded js obj (changes in different browsers) and injects it into the head
  // in the appropriate order
  function injectJs ( src, cb, attrs, timeout, /* internal use */ err, internal ) {

    var script = doc.createElement( "script" ),
        done, i;

    timeout = timeout || yepnope['errorTimeout'];

    script.src = src;

    // Add our extra attributes to the script element
    for ( i in attrs ) {
        script.setAttribute( i, attrs[ i ] );
    }

    cb = internal ? executeStack : ( cb || noop );

    // Bind to load events
    script.onreadystatechange = script.onload = function () {

      if ( ! done && isFileReady( script.readyState ) ) {

        // Set done to prevent this function from being called twice.
        done = 1;
        cb();

        // Handle memory leak in IE
        script.onload = script.onreadystatechange = null;
      }
    };

    // 404 Fallback
    sTimeout(function () {
      if ( ! done ) {
        done = 1;
        // Might as well pass in an error-state if we fire the 404 fallback
        cb(1);
      }
    }, timeout );

    // Inject script into to document
    // or immediately callback if we know there
    // was previously a timeout error
    readFirstScript();
    err ? script.onload() : firstScript.parentNode.insertBefore( script, firstScript );
  }

  // Takes a preloaded css obj (changes in different browsers) and injects it into the head
  function injectCss ( href, cb, attrs, timeout, /* Internal use */ err, internal ) {

    // Create stylesheet link
    var link = doc.createElement( "link" ),
        done, i;

    timeout = timeout || yepnope['errorTimeout'];

    cb = internal ? executeStack : ( cb || noop );

    // Add attributes
    link.href = href;
    link.rel  = "stylesheet";
    link.type = "text/css";

    // Add our extra attributes to the link element
    for ( i in attrs ) {
      link.setAttribute( i, attrs[ i ] );
    }

    if ( ! err ) {
      readFirstScript();
      firstScript.parentNode.insertBefore( link, firstScript );
      sTimeout(cb, 0);
    }
  }

  function executeStack ( ) {
    // shift an element off of the stack
    var i   = execStack.shift();
    started = 1;

    // if a is truthy and the first item in the stack has an src
    if ( i ) {
      // if it's a script, inject it into the head with no type attribute
      if ( i['t'] ) {
        // Inject after a timeout so FF has time to be a jerk about it and
        // not double load (ignore the cache)
        sTimeout( function () {
          (i['t'] == "c" ?  yepnope['injectCss'] : yepnope['injectJs'])( i['s'], 0, i['a'], i['x'], i['e'], 1 );
        }, 0 );
      }
      // Otherwise, just call the function and potentially run the stack
      else {
        i();
        executeStack();
      }
    }
    else {
      // just reset out of recursive mode
      started = 0;
    }
  }

  function preloadFile ( elem, url, type, splicePoint, dontExec, attrObj, timeout ) {

    timeout = timeout || yepnope['errorTimeout'];

    // Create appropriate element for browser and type
    var preloadElem = doc.createElement( elem ),
        done        = 0,
        firstFlag   = 0,
        stackObject = {
          "t": type,     // type
          "s": url,      // src
        //r: 0,        // ready
          "e": dontExec,// set to true if we don't want to reinject
          "a": attrObj,
          "x": timeout
        };

    // The first time (common-case)
    if ( scriptCache[ url ] === 1 ) {
      firstFlag = 1;
      scriptCache[ url ] = [];
    }

    function onload ( first ) {
      // If the script/css file is loaded
      if ( ! done && isFileReady( preloadElem.readyState ) ) {

        // Set done to prevent this function from being called twice.
        stackObject['r'] = done = 1;

        ! started && executeStack();

        if ( first ) {
          if ( elem != "img" ) {
            sTimeout( function () {
                insBeforeObj.removeChild( preloadElem ); 
              }, 50);
          }

          for ( var i in scriptCache[ url ] ) {
            if ( scriptCache[ url ].hasOwnProperty( i ) ) {
              scriptCache[ url ][ i ].onload();
            }
          }

          // Handle memory leak in IE
           preloadElem.onload = preloadElem.onreadystatechange = null;
        }
      }
    }


    // Setting url to data for objects or src for img/scripts
    if ( elem == "object" ) {
      preloadElem.data = url;

      // Setting the type attribute to stop Firefox complaining about the mimetype when running locally.
      // The type doesn't matter as long as it's real, thus text/css instead of text/javascript.
      preloadElem.setAttribute("type", "text/css");
    } else {
      preloadElem.src = url;

      // Setting bogus script type to allow the script to be cached
      preloadElem.type = elem;
    }

    // Don't let it show up visually
    preloadElem.width = preloadElem.height = "0";

    // Attach handlers for all browsers
    preloadElem.onerror = preloadElem.onload = preloadElem.onreadystatechange = function(){
      onload.call(this, firstFlag);
    };
    // inject the element into the stack depending on if it's
    // in the middle of other scripts or not
    execStack.splice( splicePoint, 0, stackObject );

    // The only place these can't go is in the <head> element, since objects won't load in there
    // so we have two options - insert before the head element (which is hard to assume) - or
    // insertBefore technically takes null/undefined as a second param and it will insert the element into
    // the parent last. We try the head, and it automatically falls back to undefined.
    if ( elem != "img" ) {
      // If it's the first time, or we've already loaded it all the way through
      if ( firstFlag || scriptCache[ url ] === 2 ) {
        readFirstScript();
        insBeforeObj.insertBefore( preloadElem, isGeckoLTE18 ? null : firstScript );

        // If something fails, and onerror doesn't fire,
        // continue after a timeout.
        sTimeout( onload, timeout );
      }
      else {
        // instead of injecting, just hold on to it
        scriptCache[ url ].push( preloadElem );
      }
    }
  }

  function load ( resource, type, dontExec, attrObj, timeout ) {
    // If this method gets hit multiple times, we should flag
    // that the execution of other threads should halt.
    started = 0;

    // We'll do 'j' for js and 'c' for css, yay for unreadable minification tactics
    type = type || "j";
    if ( isString( resource ) ) {
      // if the resource passed in here is a string, preload the file
      preloadFile( type == "c" ? strCssElem : strJsElem, resource, type, this['i']++, dontExec, attrObj, timeout );
    } else {
      // Otherwise it's a callback function and we can splice it into the stack to run
      execStack.splice( this['i']++, 0, resource );
      execStack.length == 1 && executeStack();
    }

    // OMG is this jQueries? For chaining...
    return this;
  }

  // return the yepnope object with a fresh loader attached
  function getYepnope () {
    var y = yepnope;
    y['loader'] = {
      "load": load,
      "i" : 0
    };
    return y;
  }

  /* End loader helper functions */
  // Yepnope Function
  yepnope = function ( needs ) {

    var i,
        need,
        // start the chain as a plain instance
        chain = this['yepnope']['loader'];

    function satisfyPrefixes ( url ) {
      // split all prefixes out
      var parts   = url.split( "!" ),
      gLen    = globalFilters.length,
      origUrl = parts.pop(),
      pLen    = parts.length,
      res     = {
        "url"      : origUrl,
        // keep this one static for callback variable consistency
        "origUrl"  : origUrl,
        "prefixes" : parts
      },
      mFunc,
      j,
      prefix_parts;

      // loop through prefixes
      // if there are none, this automatically gets skipped
      for ( j = 0; j < pLen; j++ ) {
        prefix_parts = parts[ j ].split( '=' );
        mFunc = prefixes[ prefix_parts.shift() ];
        if ( mFunc ) {
          res = mFunc( res, prefix_parts );
        }
      }

      // Go through our global filters
      for ( j = 0; j < gLen; j++ ) {
        res = globalFilters[ j ]( res );
      }

      // return the final url
      return res;
    }

     function getExtension ( url ) {
      //The extension is always the last characters before the ? and after a period.
      //The previous method was not accounting for the possibility of a period in the query string.
      var b = url.split('?')[0];
      return b.substr(b.lastIndexOf('.')+1);
    }

    function loadScriptOrStyle ( input, callback, chain, index, testResult ) {
      // run through our set of prefixes
      var resource     = satisfyPrefixes( input ),
          autoCallback = resource['autoCallback'],
          extension    = getExtension( resource['url'] );

      // if no object is returned or the url is empty/0 just exit the load
      if ( resource['bypass'] ) {
        return;
      }

      // Determine callback, if any
      if ( callback ) {
        callback = isFunction( callback ) ?
          callback :
          callback[ input ] ||
          callback[ index ] ||
          callback[ ( input.split( "/" ).pop().split( "?" )[ 0 ] ) ];
      }

      // if someone is overriding all normal functionality
      if ( resource['instead'] ) {
        return resource['instead']( input, callback, chain, index, testResult );
      }
      else {
        // Handle if we've already had this url and it's completed loaded already
        if ( scriptCache[ resource['url'] ] && resource['reexecute'] !== true) {
          // don't let this execute again
          resource['noexec'] = true;
        }
        else {
          scriptCache[ resource['url'] ] = 1;
        }

        // Throw this into the queue
        input && chain.load( resource['url'], ( ( resource['forceCSS'] || ( ! resource['forceJS'] && "css" == getExtension( resource['url'] ) ) ) ) ? "c" : undef, resource['noexec'], resource['attrs'], resource['timeout'] );

        // If we have a callback, we'll start the chain over
        if ( isFunction( callback ) || isFunction( autoCallback ) ) {
          // Call getJS with our current stack of things
          chain['load']( function () {
            // Hijack yepnope and restart index counter
            getYepnope();
            // Call our callbacks with this set of data
            callback && callback( resource['origUrl'], testResult, index );
            autoCallback && autoCallback( resource['origUrl'], testResult, index );

            // Override this to just a boolean positive
            scriptCache[ resource['url'] ] = 2;
          } );
        }
      }
    }

    function loadFromTestObject ( testObject, chain ) {
        var testResult = !! testObject['test'],
            group      = testResult ? testObject['yep'] : testObject['nope'],
            always     = testObject['load'] || testObject['both'],
            callback   = testObject['callback'] || noop,
            cbRef      = callback,
            complete   = testObject['complete'] || noop,
            needGroupSize;

        // Reusable function for dealing with the different input types
        // NOTE:: relies on closures to keep 'chain' up to date, a bit confusing, but
        // much smaller than the functional equivalent in this case.
        function handleGroup ( needGroup, moreToCome ) {
          /* jshint -W083 */
          if ( '' !== needGroup && ! needGroup ) {
            // Call the complete callback when there's nothing to load.
            ! moreToCome && complete();
          }
          // If it's a string
          else if ( isString( needGroup ) ) {
            // if it's a string, it's the last
            if ( !moreToCome ) {
              // Add in the complete callback to go at the end
              callback = function () {
                var args = [].slice.call( arguments );
                cbRef.apply( this, args );
                complete();
              };
            }
            // Just load the script of style
            loadScriptOrStyle( needGroup, callback, chain, 0, testResult );
          }
          // See if we have an object. Doesn't matter if it's an array or a key/val hash
          // Note:: order cannot be guaranteed on an key value object with multiple elements
          // since the for-in does not preserve order. Arrays _should_ go in order though.
          else if ( isObject( needGroup ) ) {
            // I hate this, but idk another way for objects.
            needGroupSize = (function(){
              var count = 0, i;
              for (i in needGroup ) {
                if ( needGroup.hasOwnProperty( i ) ) {
                  count++;
                }
              }
              return count;
            })();

            for ( var callbackKey in needGroup ) {
              // Safari 2 does not have hasOwnProperty, but not worth the bytes for a shim
              // patch if needed. Kangax has a nice shim for it. Or just remove the check
              // and promise not to extend the object prototype.
              if ( needGroup.hasOwnProperty( callbackKey ) ) {
                // Find the last added resource, and append to it's callback.
                if ( ! moreToCome && ! ( --needGroupSize ) ) {
                  // If this is an object full of callbacks
                  if ( ! isFunction( callback ) ) {
                    // Add in the complete callback to go at the end
                    callback[ callbackKey ] = (function( innerCb ) {
                      return function () {
                        var args = [].slice.call( arguments );
                        innerCb && innerCb.apply( this, args );
                        complete();
                      };
                    })( cbRef[ callbackKey ] );
                  }
                  // If this is just a single callback
                  else {
                    callback = function () {
                      var args = [].slice.call( arguments );
                      cbRef.apply( this, args );
                      complete();
                    };
                  }
                }
                loadScriptOrStyle( needGroup[ callbackKey ], callback, chain, callbackKey, testResult );
              }
            }
          }
        }

        // figure out what this group should do
        handleGroup( group, !!always || !!testObject['complete']);

        // Run our loader on the load/both group too
        // the always stuff always loads second.
        always && handleGroup( always );

	// If complete callback is used without loading anything
        !always && !!testObject['complete'] && handleGroup('');

    }

    // Someone just decides to load a single script or css file as a string
    if ( isString( needs ) ) {
      loadScriptOrStyle( needs, 0, chain, 0 );
    }
    // Normal case is likely an array of different types of loading options
    else if ( isArray( needs ) ) {
      // go through the list of needs
      for( i = 0; i < needs.length; i++ ) {
        need = needs[ i ];

        // if it's a string, just load it
        if ( isString( need ) ) {
          loadScriptOrStyle( need, 0, chain, 0 );
        }
        // if it's an array, call our function recursively
        else if ( isArray( need ) ) {
          yepnope( need );
        }
        // if it's an object, use our modernizr logic to win
        else if ( isObject( need ) ) {
          loadFromTestObject( need, chain );
        }
      }
    }
    // Allow a single object to be passed in
    else if ( isObject( needs ) ) {
      loadFromTestObject( needs, chain );
    }
  };

  // This publicly exposed function is for allowing
  // you to add functionality based on prefixes on the
  // string files you add. 'css!' is a builtin prefix
  //
  // The arguments are the prefix (not including the !) as a string
  // and
  // A callback function. This function is passed a resource object
  // that can be manipulated and then returned. (like middleware. har.)
  //
  // Examples of this can be seen in the officially supported ie prefix
  yepnope['addPrefix'] = function ( prefix, callback ) {
    prefixes[ prefix ] = callback;
  };

  // A filter is a global function that every resource
  // object that passes through yepnope will see. You can
  // of course conditionally choose to modify the resource objects
  // or just pass them along. The filter function takes the resource
  // object and is expected to return one.
  //
  // The best example of a filter is the 'autoprotocol' officially
  // supported filter
  yepnope['addFilter'] = function ( filter ) {
    globalFilters.push( filter );
  };

  // Default error timeout to 10sec - modify to alter
  yepnope['errorTimeout'] = 1e4;

  // Webreflection readystate hack
  // safe for jQuery 1.4+ ( i.e. don't use yepnope with jQuery 1.3.2 )
  // if the readyState is null and we have a listener
  if ( doc.readyState == null && doc.addEventListener ) {
    // set the ready state to loading
    doc.readyState = "loading";
    // call the listener
    doc.addEventListener( "DOMContentLoaded", handler = function () {
      // Remove the listener
      doc.removeEventListener( "DOMContentLoaded", handler, 0 );
      // Set it to ready
      doc.readyState = "complete";
    }, 0 );
  }

  // Attach loader &
  // Leak it
  window['yepnope'] = getYepnope();

  // Exposing executeStack to better facilitate plugins
  window['yepnope']['executeStack'] = executeStack;
  window['yepnope']['injectJs'] = injectJs;
  window['yepnope']['injectCss'] = injectCss;

})( window, document );

// Reappropriate
ModernizrProto['load'] = function() {
  window['yepnope'].apply(window, [].slice.call(arguments,0));
};



  /**
   * contains returns a boolean for if substr is found within str.
   */
  function contains( str, substr ) {
    return !!~('' + str).indexOf(substr);
  }

  ;

  var slice = classes.slice;
  

  // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
  // es5.github.com/#x15.3.4.5

  if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) {

      var target = this;

      if (typeof target != "function") {
        throw new TypeError();
      }

      var args = slice.call(arguments, 1);
      var bound = function() {

        if (this instanceof bound) {

          var F = function(){};
          F.prototype = target.prototype;
          var self = new F();

          var result = target.apply(
            self,
            args.concat(slice.call(arguments))
          );
          if (Object(result) === result) {
            return result;
          }
          return self;

        } else {

          return target.apply(
            that,
            args.concat(slice.call(arguments))
          );

        }

      };

      return bound;
    };
  }

  ;

  var createElement = document.createElement.bind(document);
  

  /**
   * Create our "modernizr" element that we do most feature tests on.
   */
  var modElem = {
    elem : createElement('modernizr')
  };

  // Clean up this element
  Modernizr._q.push(function() {
    delete modElem.elem;
  });

  

  var mStyle = {
    style : modElem.elem.style
  };

  // kill ref for gc, must happen before
  // mod.elem is removed, so we unshift on to
  // the front of the queue.
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });

  

  // testProps is a generic CSS / DOM property test.

  // In testing support for a given CSS property, it's legit to test:
  //    `elem.style[styleName] !== undefined`
  // If the property is supported it will return an empty string,
  // if unsupported it will return undefined.

  // We'll take advantage of this quick test and skip setting a style
  // on our modernizr element, but instead just testing undefined vs
  // empty string.

  // Because the testing of the CSS property names (with "-", as
  // opposed to the camelCase DOM properties) is non-portable and
  // non-standard but works in WebKit and IE (but not Gecko or Opera),
  // we explicitly reject properties with dashes so that authors
  // developing in WebKit or IE first don't end up with
  // browser-specific content by accident.

  function testProps( props, prefixed ) {
    var afterInit;

    // If we don't have a style element, that means
    // we're running async or after the core tests,
    // so we'll need to create our own elements to use
    if ( !mStyle.style ) {
      afterInit = true;
      mStyle.modElem = createElement('modernizr');
      mStyle.style = mStyle.modElem.style;
    }

    // Delete the objects if we
    // we created them.
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }

    for ( var i in props ) {
      var prop = props[i];
      if ( !contains(prop, "-") && mStyle.style[prop] !== undefined ) {
        cleanElems();
        return prefixed == 'pfx' ? prop : true;
      }
    }
    cleanElems();
    return false;
  }

  ;

  // Modernizr.testProp() investigates whether a given style property is recognized
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testProp('pointerEvents')
  var testProp = ModernizrProto.testProp = function( prop ) {
    return testProps([prop]);
  };
  
/*!
{
  "name" : "HTML5 Audio Element",
  "property": "audio",
  "aliases" : [],
  "tags" : ["html5", "audio", "media"],
  "doc" : "/docs/#audio",
  "knownBugs": [],
  "authors" : []
}
!*/

  // This tests evaluates support of the audio element, as well as
  // testing what types of content it supports.
  //
  // We're using the Boolean constructor here, so that we can extend the value
  // e.g.  Modernizr.audio     // true
  //       Modernizr.audio.ogg // 'probably'
  //
  // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
  //                     thx to NielsLeenheer and zcorpan

  // Note: in some older browsers, "no" was a return value instead of empty string.
  //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
  //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5
  Modernizr.addTest('audio', function() {
    /* jshint -W053 */
    var elem = createElement('audio');
    var bool = false;

    try {
      if ( bool = !!elem.canPlayType ) {
        bool      = new Boolean(bool);
        bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
        bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

        // Mimetypes accepted:
        //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
        //   bit.ly/iphoneoscodecs
        bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
        bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                     elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
      }
    } catch(e) { }

    return bool;
  });


  // Following spec is to expose vendor-specific style properties as:
  //   elem.style.WebkitBorderRadius
  // and the following would be incorrect:
  //   elem.style.webkitBorderRadius

  // Webkit ghosts their properties in lowercase but Opera & Moz do not.
  // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
  //   erik.eae.net/archives/2008/03/10/21.48.10/

  // More here: github.com/Modernizr/Modernizr/issues/issue/21
  var omPrefixes = 'Webkit Moz O ms';
  

  var cssomPrefixes = omPrefixes.split(' ');
  ModernizrProto._cssomPrefixes = cssomPrefixes;
  

  var domPrefixes = omPrefixes.toLowerCase().split(' ');
  ModernizrProto._domPrefixes = domPrefixes;
  

  /**
   * testDOMProps is a generic DOM property test; if a browser supports
   *   a certain property, it won't return undefined for it.
   */
  function testDOMProps( props, obj, elem ) {
    var item;

    for ( var i in props ) {
      if ( props[i] in obj ) {

        // return the property name as a string
        if (elem === false) return props[i];

        item = obj[props[i]];

        // let's bind a function (and it has a bind method -- certain native objects that report that they are a
        // function don't [such as webkitAudioContext])
        if (is(item, 'function') && 'bind' in item){
          // default to autobind unless override
          return item.bind(elem || obj);
        }

        // return the unbound function or obj or value
        return item;
      }
    }
    return false;
  }

  ;

  /**
   * testPropsAll tests a list of DOM properties we want to check against.
   *   We specify literally ALL possible (known and/or likely) properties on
   *   the element including the non-vendor prefixed one, for forward-
   *   compatibility.
   */
  function testPropsAll( prop, prefixed, elem ) {

    var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
    props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    // did they call .prefixed('boxSizing') or are we just testing a prop?
    if(is(prefixed, "string") || is(prefixed, "undefined")) {
      return testProps(props, prefixed);

      // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }

  // Modernizr.testAllProps() investigates whether a given style property,
  //   or any of its vendor-prefixed variants, is recognized
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testAllProps('boxSizing')
  ModernizrProto.testAllProps = testPropsAll;

  

  var testAllProps = ModernizrProto.testAllProps = testPropsAll;
  
/*!
{
  "name": "Background Size",
  "property": "backgroundsize",
  "tags": ["css"],
  "knownBugs": ["This will false positive in Opera Mini - http://github.com/Modernizr/Modernizr/issues/396"],
  "notes": [{
    "name": "Related Issue",
    "href": "http://github.com/Modernizr/Modernizr/issues/396"
  }]
}
!*/

  Modernizr.addTest('backgroundsize', testAllProps('backgroundSize'));


  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if(!body) {
      // Can't use the real body create a fake one.
      body = createElement('body');
      body.fake = true;
    }

    return body;
  }

  ;

  // Inject element with style element and some CSS rules
  function injectElementWithStyles( rule, callback, nodes, testnames ) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if ( parseInt(nodes, 10) ) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while ( nodes-- ) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
    // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
    // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
    // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
    // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
    style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
    div.id = mod;
    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
    (!body.fake ? div : body).innerHTML += style;
    body.appendChild(div);
    if ( body.fake ) {
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);
    // If this is done after page load we don't want to remove the body so check if body exists
    if ( body.fake ) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;

  }

  ;

  var testStyles = ModernizrProto.testStyles = injectElementWithStyles;
  
/*!
{
  "name": "Background Size Cover",
  "property": "bgsizecover",
  "tags": ["css"],
  "notes": [{
    "name" : "MDN Docs",
    "href": "http://developer.mozilla.org/en/CSS/background-size"
  }]
}
!*/


  testStyles('#modernizr{background-size:cover}', function( elem ) {
    var style = window.getComputedStyle ?
      window.getComputedStyle(elem, null)
      : elem.currentStyle;

    Modernizr.addTest('bgsizecover', style.backgroundSize == 'cover' );
  });


/*!
{
  "name": "Border Image",
  "property": "borderimage",
  "caniuse": "border-image",
  "polyfills": ["css3pie"],
  "tags": ["css"]
}
!*/

  Modernizr.addTest('borderimage', testAllProps('borderImage'));

/*!
{
  "name": "Border Radius",
  "property": "borderradius",
  "caniuse": "border-radius",
  "polyfills": ["css3pie"],
  "tags": ["css"],
  "notes": [{
    "name": "Comprehensive Compat Chart",
    "href": "http://muddledramblings.com/table-of-css3-border-radius-compliance"
  }]
}
!*/

  Modernizr.addTest('borderradius', testAllProps('borderRadius'));

/*!
{
  "name": "Box Shadow",
  "property": "boxshadow",
  "caniuse": "css-boxshadow",
  "tags": ["css"],
  "knownBugs": ["WebOS false positives on this test."]
}
!*/

  Modernizr.addTest('boxshadow', testAllProps('boxShadow'));

/*!
{
  "name": "Box Sizing",
  "property": "boxsizing",
  "caniuse": "css3-boxsizing",
  "polyfills": ["borderboxmodel", "boxsizingpolyfill", "borderbox"],
  "tags": ["css"],
  "notes": [{
    "name": "MDN Docs",
    "href": "http://developer.mozilla.org/en/CSS/box-sizing"
  },{
    "name": "Related Github Issue",
    "href": "http://github.com/Modernizr/Modernizr/issues/248"
  }]
}
!*/

  Modernizr.addTest('boxsizing', testAllProps('boxSizing') && (document.documentMode === undefined || document.documentMode > 7));

/*!
{
  "name": "CSS :checked pseudo-selector",
  "caniuse": "css-sel3",
  "property": "checked",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/879"
  }]
}
!*/

  Modernizr.addTest('checked', function(){
   return testStyles('#modernizr input {width:100px} #modernizr :checked {width:200px;display:block}', function(elem, rule){
      var cb = createElement('input');
      cb.setAttribute("type", "checkbox");
      cb.setAttribute("checked", "checked");
      elem.appendChild(cb);
      return cb.offsetWidth == 200;
    });
  });

/*!
{
  "name": "Flexbox",
  "property": "flexbox",
  "caniuse": "flexbox",
  "tags": ["css"],
  "notes": [{
    "name": "The _new_ flexbox",
    "href": "http://dev.w3.org/csswg/css3-flexbox"
  }]
}
!*/

  Modernizr.addTest('flexbox', testAllProps('flexWrap'));

/*!
{
  "name": "Flexbox (legacy)",
  "property": "flexboxlegacy",
  "tags": ["css"],
  "polyfills": ["flexie"],
  "notes": [{
    "name": "The _old_ flexbox",
    "href": "http://www.w3.org/TR/2009/WD-css3-flexbox-20090723/"
  }]
}
!*/

  Modernizr.addTest('flexboxlegacy', testAllProps('boxDirection'));

/*!
{
  "name": "@font-face",
  "property": "fontface",
  "authors": ["Diego Perini"],
  "tags": ["css"],
  "knownBugs": [
    "False Positive: WebOS http://github.com/Modernizr/Modernizr/issues/342",
    "False Postive: WP7 http://github.com/Modernizr/Modernizr/issues/538"
  ],
  "notes": [{
    "name": "@font-face detection routine by Diego Perini",
    "href": "http://javascript.nwbox.com/CSSSupport/"
  }]
}
!*/

  testStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
    var style = document.getElementById('smodernizr');
    var sheet = style.sheet || style.styleSheet;
    var cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
    var bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;

    Modernizr.addTest('fontface', bool);
  });

/*!
{
  "name": "CSS Generated Content",
  "property": "generatedcontent",
  "tags": ["css"],
  "warnings": ["Android won't return correct height for anything below 7px #738"]
}
!*/

  testStyles('#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:7px/1 a}', function( node ) {
    Modernizr.addTest('generatedcontent', node.offsetHeight >= 7);
  });


  // List of property values to set for css tests. See ticket #21
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

  // expose these for the plugin API. Look in the source for how to join() them against your input
  ModernizrProto._prefixes = prefixes;

  
/*!
{
  "name": "CSS Gradients",
  "caniuse": "css-gradients",
  "property": "cssgradients",
  "tags": ["css"],
  "notes": [{
    "name": "Webkit Gradient Syntax",
    "href": "http://webkit.org/blog/175/introducing-css-gradients/"
  },{
    "name": "Mozilla Linear Gradient Syntax",
    "href": "http://developer.mozilla.org/en/CSS/-moz-linear-gradient"
  },{
    "name": "Mozilla Radial Gradient Syntax",
    "href": "http://developer.mozilla.org/en/CSS/-moz-radial-gradient"
  },{
    "name": "W3C Gradient Spec",
    "href": "dev.w3.org/csswg/css3-images/#gradients-"
  }]
}
!*/


  Modernizr.addTest('cssgradients', function() {

    var str1 = 'background-image:';
    var str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
    var str3 = 'linear-gradient(left top,#9f9, white);';

    var css =
      // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
      (str1 + '-webkit- '.split(' ').join(str2 + str1) +
       // standard syntax             // trailing 'background-image:'
       prefixes.join(str3 + str1)).slice(0, -str1.length);

    var elem = createElement('div');
    var style = elem.style;
    style.cssText = css;

    // IE6 returns undefined so cast to string
    return ('' + style.backgroundImage).indexOf('gradient') > -1;
  });

/*!
{
  "name": "CSS HSLA Colors",
  "caniuse": "css3-colors",
  "property": "hsla",
  "tags": ["css"],
  "notes": ["Same as rgba(), in fact, browsers re-map hsla() to rgba() internally, except IE9 who retains it as hsla"]
}
!*/

  Modernizr.addTest('hsla', function() {
    var elem = createElement('div');
    var style = elem.style;
    style.cssText = 'background-color:hsla(120,40%,100%,.5)';
    return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
  });

/*!
{
  "name": "CSS :last-child pseudo-selector",
  "caniuse": "css-sel3",
  "property": "lastchild",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/304"
  }]
}
!*/

  testStyles("#modernizr div {width:100px} #modernizr :last-child{width:200px;display:block}", function( elem ) {
    Modernizr.addTest('lastchild', elem.lastChild.offsetWidth > elem.firstChild.offsetWidth);
  }, 2);


  // adapted from matchMedia polyfill
  // by Scott Jehl and Paul Irish
  // gist.github.com/786768
  var testMediaQuery = function( mq ) {
    var matchMedia = window.matchMedia || window.msMatchMedia;
    var bool;
    if ( matchMedia ) {
      return matchMedia(mq) && matchMedia(mq).matches || false;
    }

    injectElementWithStyles('@media ' + mq + ' { #modernizr { position: absolute; } }', function( node ) {
      bool = (window.getComputedStyle ?
              getComputedStyle(node, null) :
              node.currentStyle)['position'] == 'absolute';
    });

    return bool;
  };

  

  // Modernizr.mq tests a given media query, live against the current state of the window
  // A few important notes:
  //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
  //   * A max-width or orientation query will be evaluated against the current state, which may change later.
  //   * You must specify values. Eg. If you are testing support for the min-width media query use:
  //       Modernizr.mq('(min-width:0)')
  // usage:
  // Modernizr.mq('only screen and (max-width:768)')
  var mq = ModernizrProto.mq = testMediaQuery;
  
/*!
{
  "name": "CSS Media Queries",
  "caniuse": "css-mediaqueries",
  "property": "mediaqueries",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('mediaqueries', mq('only all'));

/*!
{
  "name": "CSS Multiple Backgrounds",
  "caniuse": "multibackgrounds",
  "property": "multiplebgs",
  "tags": ["css"]
}
!*/

  // Setting multiple images AND a color on the background shorthand property
  // and then querying the style.background property value for the number of
  // occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

  Modernizr.addTest('multiplebgs', function() {
    var elem = createElement('div');
    var style = elem.style;
    style.cssText = 'background:url(https://),url(https://),red url(https://)';

    // If the UA supports multiple backgrounds, there should be three occurrences
    // of the string "url(" in the return value for elemStyle.background
    return (/(url\s*\(.*?){3}/).test(style.background);
  });

/*!
{
  "name": "CSS Opacity",
  "caniuse": "css-opacity",
  "property": "opacity",
  "tags": ["css"],
  "notes": ["Opacity must be be in the range of [0.0,1.0], according to the spec."]
}
!*/

  // Browsers that actually have CSS Opacity implemented have done so
  // according to spec, which means their return values are within the
  // range of [0.0,1.0] - including the leading zero.

  Modernizr.addTest('opacity', function() {
    var elem = createElement('div');
    var style = elem.style;
    style.cssText = prefixes.join('opacity:.55;');

    // The non-literal . in this regex is intentional:
    // German Chrome returns this value as 0,55
    // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
    return (/^0.55$/).test(style.opacity);
  });

/*!
{
  "name": "CSS Pointer Events",
  "caniuse": "pointer-events",
  "property": "csspointerevents",
  "authors": ["ausi"],
  "tags": ["css"],
  "notes": [
    {
      "name": "MDN Docs",
      "href": "http://developer.mozilla.org/en/CSS/pointer-events"
    },{
      "name": "Test Project Page",
      "href": "http://ausi.github.com/Feature-detection-technique-for-pointer-events/"
    },{
      "name": "Test Project Wiki",
      "href": "http://github.com/ausi/Feature-detection-technique-for-pointer-events/wiki"
    },
    {
      "name": "Related Github Issue",
      "href": "http://github.com/Modernizr/Modernizr/issues/80"
    }
  ]
}
!*/

  Modernizr.addTest('csspointerevents', function() {
    var element = createElement('x');
    var getComputedStyle = window.getComputedStyle;
    var supports;
    if(!('pointerEvents' in element.style)){
      return false;
    }
    element.style.pointerEvents = 'auto';
    element.style.pointerEvents = 'x';
    docElement.appendChild(element);
    supports = getComputedStyle &&
      getComputedStyle(element, '').pointerEvents === 'auto';
    docElement.removeChild(element);
    return !!supports;
  });

/*!
{
  "name": "CSS Font rem Units",
  "caniuse": "rem",
  "authors": ["nsfmc"],
  "property": "cssremunit",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "http://www.w3.org/TR/css3-values/#relative0"
  },{
    "name": "Font Size with rem by Jonathan Snook",
    "href": "http://snook.ca/archives/html_and_css/font-size-with-rem"
  }]
}
!*/

  // "The 'rem' unit ('root em') is relative to the computed
  // value of the 'font-size' value of the root element."
  // you can test by checking if the prop was ditched

  Modernizr.addTest('cssremunit', function() {
    var div = createElement('div');
    try {
      div.style.fontSize = '3rem';
    }
    catch( er ) {}
    return (/rem/).test(div.style.fontSize);
  });


  // css-tricks.com/rgba-browser-support/

  Modernizr.addTest('rgba', function() {
    var elem = createElement('div');
    var style = elem.style;
    style.cssText = 'background-color:rgba(150,255,150,.5)';

    return ('' + style.backgroundColor).indexOf('rgba') > -1;
  });

/*!
{
  "name": "CSS Stylable Scrollbars",
  "property": "cssscrollbar",
  "tags": ["css"]
}
!*/

  testStyles('#modernizr{overflow: scroll; width: 40px; height: 40px; }#' + prefixes
    .join('scrollbar{width:0px}'+' #modernizr::')
    .split('#')
    .slice(1)
    .join('#') + 'scrollbar{width:0px}',
  function( node ) {
    Modernizr.addTest('cssscrollbar', node.scrollWidth == 40);
  });


  // FF3.0 will false positive on this test
  Modernizr.addTest('textshadow', createElement('div').style.textShadow === '');


  Modernizr.addTest('csstransforms', !!testAllProps('transform'));


  Modernizr.addTest('csstransforms3d', function() {
    var ret = !!testAllProps('perspective');

    // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
    //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
    //   some conditions. As a result, Webkit typically recognizes the syntax but
    //   will sometimes throw a false positive, thus we must do a more thorough check:
    if ( ret && 'webkitPerspective' in docElement.style ) {

      // Webkit allows this media query to succeed only if the feature is enabled.
      // `@media (transform-3d),(-webkit-transform-3d){ ... }`
      // If loaded inside the body tag and the test element inherits any padding, margin or borders it will fail #740
      testStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}', function( node, rule ) {
        ret = node.offsetLeft === 9 && node.offsetHeight === 5;
      });
    }
    return ret;
  });


  Modernizr.addTest('csstransitions', testAllProps('transition'));


  // classList
  // https://developer.mozilla.org/en/DOM/element.classList
  Modernizr.addTest('classlist', 'classList' in docElement);


  // dataset API for data-* attributes
  // test by @phiggins42
  Modernizr.addTest('dataset', function() {
    var n = createElement("div");
    n.setAttribute("data-a-b", "c");
    return !!(n.dataset && n.dataset.aB === "c");
  });


  // strict mode
  // test by @kangax
  Modernizr.addTest('strictmode', (function(){  return !this; })());



  // Detects whether input type="file" is available on the platform
  // E.g. iOS < 6 and some android version don't support this

  //  It's useful if you want to hide the upload feature of your app on devices that
  //  don't support it (iphone, ipad, etc).

  Modernizr.addTest('fileinput', function() {
    if(navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
        return false;
    }
    var elem = createElement('input');
    elem.type = 'file';
    return !elem.disabled;
  });


  // Detects whether input form="form_id" is available on the platform
  // E.g. IE 10 (and below), don't support this
  Modernizr.addTest('formattribute', function() {
    var form = createElement('form');
    var input = createElement('input');
    var div = createElement('div');
    var id = 'formtest' + (new Date()).getTime();
    var attr;
    var bool = false;

    form.id = id;

    //IE6/7 confuses the form idl attribute and the form content attribute, so we use document.createAttribute
    try {
      input.setAttribute("form", id);
    }
    catch( e ) {
      if( document.createAttribute ) {
        attr = document.createAttribute("form");
        attr.nodeValue = id;
        input.setAttributeNode(attr);
      }
    }

    div.appendChild(form);
    div.appendChild(input);

    docElement.appendChild(div);

    bool = form.elements.length === 1 && input.form == form;

    div.parentNode.removeChild(div);
    return bool;
  });


  // testing for placeholder attribute in inputs and textareas
  Modernizr.addTest('placeholder', ('placeholder' in createElement('input') && 'placeholder' in createElement('textarea')));


  // Test for the history API
  // http://dev.w3.org/html5/spec/history.html#the-history-interface
  // by Hay Kranen < http://github.com/hay > with suggestions by aFarkas
  // http://dev.w3.org/html5/spec/history.html#the-history-interface
  Modernizr.addTest('history', function() {
    // Issue #733
    // The stock browser on Android 2.2 & 2.3 returns positive on history support
    // Unfortunately support is really buggy and there is no clean way to detect
    // these bugs, so we fall back to a user agent sniff :(
    var ua = navigator.userAgent;

    // We only want Android 2, stock browser, and not Chrome which identifies
    // itself as 'Mobile Safari' as well
    if (ua.indexOf('Android 2') !== -1 &&
        ua.indexOf('Mobile Safari') !== -1 &&
          ua.indexOf('Chrome') === -1) {
      return false;
    }

    // Return the regular check
    return (window.history && 'pushState' in history);
  });


  var attrs = {};
  

  var inputattrs = 'autocomplete autofocus list placeholder max min multiple pattern required step'.split(' ');
  

  var inputElem = createElement('input');
  

  // Run through HTML5's new input attributes to see if the UA understands any.
  // We're using f which is the <input> element created early on
  // Mike Taylr has created a comprehensive resource for testing these attributes
  //   when applied to all input types:
  //   miketaylr.com/code/input-type-attr.html
  // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

  // Only input placeholder is tested while textarea's placeholder is not.
  // Currently Safari 4 and Opera 11 have support only for the input placeholder
  // Both tests are available in feature-detects/forms-placeholder.js
  Modernizr['input'] = (function( props ) {
    for ( var i = 0, len = props.length; i < len; i++ ) {
      attrs[ props[i] ] = !!(props[i] in inputElem);
    }
    if (attrs.list){
      // safari false positive's on datalist: webk.it/74252
      // see also github.com/Modernizr/Modernizr/issues/146
      attrs.list = !!(createElement('datalist') && window.HTMLDataListElement);
    }
    return attrs;
  })(inputattrs);


  var inputtypes = 'search tel url email datetime date month week time datetime-local number range color'.split(' ');
  

  var inputs = {};
  

  var smile = ':)';
  

  // Run through HTML5's new input types to see if the UA understands any.
  //   This is put behind the tests runloop because it doesn't return a
  //   true/false like all the other tests; instead, it returns an object
  //   containing each input type with its corresponding true/false value

  // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
  Modernizr['inputtypes'] = (function(props) {
    var bool;
    var inputElemType;
    var defaultView;
    var len = props.length;

    for ( var i = 0; i < len; i++ ) {

      inputElem.setAttribute('type', inputElemType = props[i]);
      bool = inputElem.type !== 'text';

      // We first check to see if the type we give it sticks..
      // If the type does, we feed it a textual value, which shouldn't be valid.
      // If the value doesn't stick, we know there's input sanitization which infers a custom UI
      if ( bool ) {

        inputElem.value         = smile;
        inputElem.style.cssText = 'position:absolute;visibility:hidden;';

        if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

          docElement.appendChild(inputElem);
          defaultView = document.defaultView;

          // Safari 2-4 allows the smiley as a value, despite making a slider
          bool =  defaultView.getComputedStyle &&
            defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
            // Mobile android web browser has false positive, so must
            // check the height to see if the widget is actually there.
            (inputElem.offsetHeight !== 0);

          docElement.removeChild(inputElem);

        } else if ( /^(search|tel)$/.test(inputElemType) ){
          // Spec doesn't define any special parsing or detectable UI
          //   behaviors so we pass these through as true

          // Interestingly, opera fails the earlier test, so it doesn't
          //  even make it here.

        } else if ( /^(url|email)$/.test(inputElemType) ) {
          // Real url and email support comes with prebaked validation.
          bool = inputElem.checkValidity && inputElem.checkValidity() === false;

        } else {
          // If the upgraded input compontent rejects the :) text, we got a winner
          bool = inputElem.value != smile;
        }
      }

      inputs[ props[i] ] = !!bool;
    }
    return inputs;
  })(inputtypes);


  // native JSON support.
  // developer.mozilla.org/en/JSON

  // this will also succeed if you've loaded the JSON2.js polyfill ahead of time
  //   ... but that should be obvious. :)

  Modernizr.addTest('json', !!window.JSON && !!JSON.parse);


  // Thanks to Erik Dahlstrom
  Modernizr.addTest('svg', !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);

/*!
{
  "name": "Touch Events",
  "property": "touchevents",
  "caniuse" : "touch",
  "tags": ["media", "attribute"],
  "notes": [{
      "name": "Touch Events spec",
      "href": "http://www.w3.org/TR/2013/WD-touch-events-20130124/"
    },
    {
      "name": "Touch Events test page",
      "href": "http://modernizr.github.com/Modernizr/touch.html"
    }
  ],
  "warnings": [
    "Indicates if the browser supports the Touch Events spec, which does not necessarily reflect a touchscreen device"
  ],
  "knownBugs": [
    "False-positive on some configurations of Nokia N900"
  ]
}
!*/
/* DOC

The `Modernizr.touch` test only indicates if the browser supports touch events, which does not necessarily reflect a touchscreen device, as evidenced by tablets running Windows 7 or, alas, the Palm Pre / WebOS (touch) phones.

We also test for Firefox 4 Multitouch Support.

Chrome (desktop) used to lie about its support on this, but that has since been rectified: http://crbug.com/36415
*/

  Modernizr.addTest('touchevents', function() {
    var bool;
    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      bool = true;
    } else {
      var query = ['@media (',prefixes.join('touch-enabled),('),'heartz',')','{#modernizr{top:9px;position:absolute}}'].join('');
      testStyles(query, function( node ) {
        bool = node.offsetTop === 9;
      });
    }
    return bool;
  }, {
    aliases : ['touch']
  });


  /**
   * Unicode special character support
   *
   * Detection is made by testing missing glyph box rendering against star character
   * If widths are the same, this "probably" means the browser didn't support the star character and rendered a glyph box instead
   * Just need to ensure the font characters have different widths
   *
   * Warning : positive Unicode support doesn't mean you can use it inside <title>, this seams more related to OS & Language packs
   */
  Modernizr.addTest('unicode', function() {
    var bool;
    var missingGlyph = createElement('span');
    var star = document.createElement('span');

    testStyles('#modernizr{font-family:Arial,sans;font-size:300em;}', function( node ) {

      missingGlyph.innerHTML = '&#5987';
      star.innerHTML = '&#9734';

      node.appendChild(missingGlyph);
      node.appendChild(star);

      bool = 'offsetWidth' in missingGlyph && missingGlyph.offsetWidth !== star.offsetWidth;
    });

    return bool;

  });


  // data uri test.
  // https://github.com/Modernizr/Modernizr/issues/14

  // This test is asynchronous. Watch out.

  Modernizr.addAsyncTest(function() {

    // IE7 throw a mixed content warning on HTTPS for this test, so we'll
    // just blacklist it (we know it doesn't support data URIs anyway)
    // https://github.com/Modernizr/Modernizr/issues/362
    if(navigator.userAgent.indexOf('MSIE 7.') !== -1) {
      // Keep the test async
      setTimeout(function () {
        addTest('datauri', false);
      }, 10);
    }

    var datauri = new Image();

    datauri.onerror = function() {
      addTest('datauri', false);
    };
    datauri.onload = function() {
      if(datauri.width == 1 && datauri.height == 1) {
        testOver32kb();
      }
      else {
        addTest('datauri', false);
      }
    };

    datauri.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    // Once we have datauri, let's check to see if we can use data URIs over
    // 32kb (IE8 can't). https://github.com/Modernizr/Modernizr/issues/321
    function testOver32kb(){

      var datauriBig = new Image();

      datauriBig.onerror = function() {
          addTest('datauri', true);
          Modernizr.datauri = new Boolean(true);
          Modernizr.datauri.over32kb = false;
      };
      datauriBig.onload = function() {
          addTest('datauri', true);
          Modernizr.datauri = new Boolean(true);
          Modernizr.datauri.over32kb = (datauriBig.width == 1 && datauriBig.height == 1);
      };

      var base64str = "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      while (base64str.length < 33000) {
        base64str = "\r\n" + base64str;
      }
      datauriBig.src= "data:image/gif;base64," + base64str;
    }

  });


  // This test evaluates support of the video element, as well as
  // testing what types of content it supports.
  //
  // We're using the Boolean constructor here, so that we can extend the value
  // e.g.  Modernizr.video     // true
  //       Modernizr.video.ogg // 'probably'
  //
  // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
  //                     thx to NielsLeenheer and zcorpan

  // Note: in some older browsers, "no" was a return value instead of empty string.
  //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
  //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

  Modernizr.addTest('video', function() {
    /* jshint -W053 */
    var elem = createElement('video');
    var bool = false;

    // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
    try {
      if ( bool = !!elem.canPlayType ) {
        bool = new Boolean(bool);
        bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,'');

        // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
        bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

        bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
      }
    } catch(e){}

    return bool;
  });


    // Run each test
  testRunner();

  // Remove the "no-js" class if it exists
  setClasses(classes);

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  // Run the things that are supposed to run after the tests
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  // Leak Modernizr namespace
  window.Modernizr = Modernizr;



})(this, document);