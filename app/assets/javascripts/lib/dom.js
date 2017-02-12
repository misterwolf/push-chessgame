//= require namespace
//= require lib/namespace

(function(dom){
  'use strict';

  /**
 * Shorthand for document.getElementById
 *
 * @param  {String}      id  The id to search for
 * @return {HTMLElement}     An HTMLElement if found
 */
  dom.id = function(id) {
    return document.getElementById(id) || undefined;
  };

  /**
   * Shorthand for `document.getElementsByClassName`
   *
   * @param {string} search  The class name to search
   * @return {array}         An array of matching nodes
   */
  dom.elementsByClass = function(search) {
    var results = document.getElementsByClassName(search);

    return nodeListToArray(results);
  };

  /**
   * remove an html element
   * @param {HTMLelement} elem  HTML element
   */
  dom.remove = function(elem) {
    if (typeof elem === 'object'){
      elem.parentNode.removeChild(elem);
      return 0;
    }
    return undefined;
  };

  /**
   * Converts a DOM NodeList to Array
   * @param {nodes elements} nodes
   * @return {array}         An array of matching nodes
   */
  function nodeListToArray(nodes) {
    var ary = [];

    for (var i = 0; i < nodes.length; i++) {

      ary.push(nodes[i]);

    }
    return ary;
  }

  /**
   * Insert HTML node into DOM
   * @param {nodes elements} nodes
   */
  dom.insertElement = function(element, target){
    target.appendChild(element);
  };

  // to test
  /**
   * Insert HTML node into DOM
   * @param {nodes elements} nodes
   */
  dom.insertInnerHTML = function(string_element, target){
    target.innerHTML = string_element;
  };

  /**
   * create HTML element
   * @param {string} tag
   * @param {string} id   the id of the element
   * @param {string} className the class of the element
   */
  dom.createElement = function(tag, id, className){
    className = className || '';
    id = id || '';
    // TO DO: in future className can accept multiple className
    var elem = document.createElement(tag);
    elem.className = className;
    elem.id = id;
    return elem;
  };

  /*
   * Add an event listener on element
   * @param {string} element: element HTML
   * @param {eventName}: name of event
   */
  dom.addEventListener = function(obj, type, fn){
    obj.addEventListener( type, fn, true );
  };

  /**
    * Remove Event Listener
    * @param {Node}     obj  Node to bind to
    * @param {String}   type Event name
    * @param {Function} fn   Callback
    *
    * @function
    * @memberof _iub.jlib.dom
    */
  dom.removeEventListener = function( obj, type, fn, useCapture ) {
    obj.removeEventListener( type, fn, !!useCapture );
  };

  /**
    * onReady function
    * @param {function}     callback when DOM is ready
    *
    * @function
    * @memberof _iub.jlib.dom
    */
  dom.ready = function(fn){

    var done = false, top = true,
    win = window,
    doc = document,
    root = doc.documentElement,
    modern = doc.addEventListener,

    add = modern ? 'addEventListener' : 'attachEvent',
    rem = modern ? 'removeEventListener' : 'detachEvent',
    pre = modern ? '' : 'on',

    init = function(e) {
      if (e.type === 'readystatechange' && doc.readyState !== 'complete') {
        return;
      }
      (e.type === 'load' ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        fn.call(win, e.type || e);
      }
    },

    poll = function() {
      try { root.doScroll('left'); } catch (e) { setTimeout(poll, 50); return; }
      init('poll');
    };

    if (doc.readyState === 'complete') {
      fn.call(win, 'lazy');

    } else {

      if (!modern && root.doScroll) {
        try { top = !win.frameElement; } catch (e) { }
        if (top) {
          poll();
        }
      }

      doc[add](pre + 'DOMContentLoaded', init, false);
      doc[add](pre + 'readystatechange', init, false);
      window[add](pre + 'load', init, false);
    }
  };

})(window._chess.lib.dom = {});
