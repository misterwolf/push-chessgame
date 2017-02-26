//= require websocket_rails/main
//= require namespace
//= require lib/namespace
//= require lib/ajax
//= require lib/json
//= require lib/eventmanager
//= require lib/dom
//= require socket/namespace
//= require ui/namespace

(function(modal, socket, lib){
  'use strict';

  var dom = lib.dom;

  var DIV_ID_CONNECT = 'connect-btn';
  var MODAL = 'myModal';

  modal.init = function(){
    dom.addEventListener(modal.btnCloseModal(),   'click', modal.hide);
  };

  modal.description = function(){
    return dom.id('modalDescription');
  };

  modal.btnCloseModal = function(){
    return dom.id('modalCloseButton');
  };

  modal.modalElem = function(){
    return dom.id(MODAL);
  };

  modal.show = function(){
    var elem = modal.modalElem();
    elem.classList.add('enabled');
    elem.classList.remove('disabled');
  };

  modal.hide = function(){
    var elem = modal.modalElem();
    elem.classList.remove('enabled');
    elem.classList.add('disabled');
  };

  modal.build = function(){
    // to do, in future, not now.
  };

})(window._chess.ui.modal = {}, window._chess.socket, window._chess.lib);
