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
    return document.getElementById(id);
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
   * Converts a DOM NodeList to Array
   */
  function nodeListToArray(nodes) {
    var ary = [];
    for (var i = 0; i < nodes.length; i++) {
      ary.push(nodes[i]);
    }
    return ary;
  }

})(window._chess.lib.dom = {});
