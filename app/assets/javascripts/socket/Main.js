//= require websocket_rails/main
//= require namespace
//= require socket/namespace
//= require socket/Connection
//= require lib/dom

(function(main, dom){

  // var Mainsocket = function(){

  // DEFAULT VALUES.
  var DIV_ID_GENERAL_MESSAGE_USER = 'general-message-user';
  var MESSAGE_FOR_WELCOME = 'Welcome!';
  var MESSAGE_FOR_GOODBYE = 'Goodbye!';
  var DIV_ID_CONTAINER_ALL_CLIENTS = 'all-clients';

  var currentUserId = null;
  main.state = null;
  main.welcomeMessage = '';
  main.connection = null;

  main.init = function(opts){
    opts = opts || {}; // channels will be defined in opts.

    currentUserId = opts.currentUserId;
    if (currentUserId === null){
      return;
    }

    this.welcomeMessage = opts.welcomeMessage || MESSAGE_FOR_WELCOME;
    this.state = 'initialized';

    this.connection = connection.init(opts,null);
  };

  var fillGeneralMessage = function(msg){
    dom.id(DIV_ID_GENERAL_MESSAGE_USER).innerHTML = msg;
  };

  var addInfoUser = function(){
    var elem = dom.createElement('div', currentUserId);
    var target = dom.id(DIV_ID_CONTAINER_ALL_CLIENTS);
    dom.insertElement(elem,target);
  };

  main.onOpen = function(cb){
    fillGeneralMessage(MESSAGE_FOR_WELCOME);
    addInfoUser();
    if (cb){
      cb();
    }
  };

  main.onClose = function(){
    fillGeneralMessage(MESSAGE_FOR_GOODBYE);
    dom.remove( dom.id(currentUserId) );
  };

  // };

  // window._chess.socket.MainSocket = MainSocket;

})(window._chess.socket.main = {}, window._chess.lib.dom);
