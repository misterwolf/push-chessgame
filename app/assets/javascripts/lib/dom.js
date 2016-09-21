//= require namespace
//= require lib/namespace

(function(dom){

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
   * Insert HTML into DOM
   * @param {nodes elements} nodes
   */
  dom.insertElement = function(element, target){
    target.appendChild(element);
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

})(window._chess.lib.dom = {});